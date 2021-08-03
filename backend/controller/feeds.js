let express = require('express');
let router = express.Router();
const firebase = require('../firebaseConfig').firebaseApp;
const getFeedsData = require('../services/articles/getFeedsData');
const getrawdata = require('../services/articles/getRawData');
const getArticlesFromFeeds = require('../services/articles/getArticlesFromFeeds');
let cron = require('node-cron');


updatearticles();
cron.schedule('0 0 */1 * * *', () => {//Every Hour
    updatearticles();
  });
  /*cron.schedule('* * * * *', () => {//Every Minute
    updatearticles();
  });*/




router.get('', async function (request, response) {
    //TODO : Get adequate RSS feeds links from db and filter/sort recent articles to show them
    let data = [];
    getActiveFeeds(async function(userfeeds){
        if (userfeeds == null) {
            return response.status(404).json({msg: "No active feed found"});
        }
        const j = await Promise.all( 
            userfeeds.map(async(feed) => {
            var list = await getArticlesFromFeeds(feed);
            if (list != null) {
                const id = feed.id;
                const icon = feed.data.icon;
                const title = feed.data.title;
                data.push({title: title, id: id, icon: icon ,articles: list});        
            }
        }));
        if (data == []) {
            return response.status(404).json({msg: "No article found in active feeds"});
        }    
        return response.status(200).json({data: data});
    }); //TODO change by user's feeds.

});

router.post('/state/:id', async function (request, response) { //Change feed's state
    try{
        var id = request.params.id;
        let state = request.body.state;
        if(!id||state==undefined||state==null)
        return response.status(400).send({ error: "Missing parameters" });

        const articlesRef = firebase.firestore().collection('articlefeed');
        const doc = await articlesRef.doc(id).get();

        if (doc.empty) {
        return response.status(404).json({msg: "This feed doesn't exist"});
        }

        let data = doc.data();
        data.state = state;
        const res = await firebase.firestore().collection('articlefeed').doc(id).update(data);
        await updatearticles();
        return response.status(201).json(id);
    }catch(error){
        return response.status(500).json({msg: "Unknown error"});
    }
});

router.post('', async function (request, response) { //Create new feed
    try{
        var data = request.body.data;
        const articlesRef = firebase.firestore().collection('articlefeed');
        const snapshot = await articlesRef.where('link', '==', data.link).get();

        if (!snapshot.empty) {
        return response.status(409).json({msg: "This feed already exists"});
        }

        const res = await firebase.firestore().collection('articlefeed').add(data);

        await updatearticles();
        return response.status(201).json(res.id);
    }catch(error){
        return response.status(500).json({msg: "Unknown error"});
    }

});

router.put('/:id', async function (request, response) { //Modify feed's infos
    try{
        var id = request.params.id;
        if(!id)
        return response.status(400).send({ error: "Missing parameters" });

        var data = request.body.data;
        const articlesRef = firebase.firestore().collection('articlefeed');
        const doc = await articlesRef.doc(id).get();

        if (doc.empty) {
        return response.status(404).json({msg: "This feed doesn't exist"});
        }

        const res = await firebase.firestore().collection('articlefeed').doc(id).update(data);
        await updatearticles();
        return response.status(201).json(id);
    }catch(error){
        return response.status(500).json({msg: "Unknown error"});
    }
});





router.post('/getraw', async function (request, response) {
    try{
        var link = request.body.link;
        var data = await getrawdata(link);
        return response.status(200).json(data);
    }catch(e){
        return response.status(404).json({msg:"An Error Occured with this link"});
    }
});

router.get('/allfeeds', function (request, response) {
    getAllFeeds(async function(feeds){
        if (feeds !=null) {
            return response.status(200).json({feeds});
        }else{
            return response.status(404).json({msg: "No feeds found"});
        }
    });
});
router.get('/feed/:id', function (request, response) {
    var id = request.params.id;
    if(!id)
    return response.status(400).send({ error: "Missing parameters" });

    getFeed(id ,async function(feed){
        if(feed.success){
            const id = feed.doc.id;
            data = {id: id, data: feed.doc.data};
            return response.status(200).json({data: data});

        }else if(feed.error === "404"){
            return response.status(404).json({msg: "Feed not Found"});
        }else{
            return response.status(500).json({msg: "Unknown Error"});
        }

    });

});

router.get('/:id', function (request, response) {
    //TODO : Get adequate RSS feeds links from db and filter/sort recent articles to show them
    let data;
    var id = request.params.id;
    if(!id)
    return response.status(400).send({ error: "Missing parameters" });

    getFeed(id ,async function(feed){
        if(feed.success){
            if (!feed.doc.data.state) {
                return response.status(401).json({msg: "This feed is disabled"});
            }
            let list = await getArticlesFromFeeds(feed.doc);
            const id = feed.doc.id;
            const icon = feed.doc.data.icon;
            const title = feed.doc.data.title;
            if (list != null) {
                data = {title: title, id: id, icon: icon ,articles: list};
                return response.status(200).json({data: data});
            }else{
                return response.status(404).json({msg: "No article found for this feed"});
            }
            
        }else if(feed.error === "404"){
            return response.status(404).json({msg: "Feed not Found"});
        }else{
            return response.status(500).json({msg: "Unknown Error"});
        }
    });
});

router.delete('/:id', async function (request, response) {
    var id = request.params.id;
    if(!id)
    return response.status(400).send({ error: "Missing parameters" });

    try {       
        const feedRef = firebase.firestore().collection('articlefeed');
        const doc = await feedRef.doc(id);
        const res = await doc.get();
        
        if(res.exists){

            const articlesRef = firebase.firestore().collection('article');
            const snapshot = await articlesRef.where('feed', '==', id).get();
            if (!snapshot.empty) {
                
                snapshot.forEach(async(doc) => {
                    await deletearticle(doc.id);
                });
            }
            const doc1 = await feedRef.doc(id);
            await doc1.delete();
            const doc2 = await feedRef.doc(id);
            const res2 = await doc2.get();
            if (!res2.exists) {
                return response.status(200).json({msg: "This feed and its articles was successfully deleted"});
            }else{
                return response.status(500).json({msg: "A problem was encountered while deleting this feed"});
            }
        }else{
            return response.status(404).json({msg: "Feed not found"})
        }
    } catch (error) {
        console.log(error)
        return response.status(500).json({msg: "Server error"})
    }
});


async function deletearticle(id){
    if (id) {
        const articleRef = firebase.firestore().collection('article');
        const doc = await articleRef.doc(id);
        const res = await doc.get();
        if(res.exists){
            const doc1 = await articleRef.doc(id);
            await doc1.delete();
            const doc2 = await articleRef.doc(id);
            const res2 = await doc2.get();
            if (!res2.exists) {
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }else{
        return false;
    }
}

async function updatearticles(){//Adds new articles to database
    let articleslenght = 0;
    let newarticles = 0;
    let existingarticles = 0;
    let adderrors = 0;
    const size = await getlastArticleid();
    if (size == null) {
        console.log("Update Error : Couldn't access database");
        return 0;
    }
    try {
    let id = size;  
    await getActiveFeeds(async function(feeds){
        if (feeds == null) {
            console.log("Update Error : Can't get active feeds");
            return 0;
        }
        await Promise.all( 
        feeds.map(async(feed) => {
        let link = feed.data.link;
        var res = await getFeedsData(link, feed);

        await Promise.all( 
            res.articles.map(async(article) => {
                articleslenght++;
                
                let articlelink = getElem(article,res.itemlinkpath);
                const articlesRef = firebase.firestore().collection('article');
                const snapshot = await articlesRef.where('link', '==', articlelink).get();


                if (snapshot.empty) {
                    let articletitle = getElem(article,res.itemtitlepath);
                    let articledesc = getElem(article,res.itemdescriptionpath);
                    let articleimg = getElem(article,res.itemimagepath);
                    let articlecreator = getElem(article,res.itemcreatorpath);
                    let idate = getElem(article,res.itemdatepath);
                    let feedicon = res.icon;
                    let articledate = (Date.parse(idate));
                
                    //TODO : create a timestamp from this
                    let data = {author: articlecreator, date: articledate, link: articlelink, description: articledesc, image: articleimg, feed: res.id, feedicon: feedicon,title: articletitle}
                    const addresult = await addArticle(id++, data);
                    if (addresult) {
                        newarticles++;
                    }else{
                        adderrors++
                    }

                }else{
                    existingarticles++;
                }

            })      
        );
        })
    );
    await setlastArticleid(id);
    console.log("Updated articles : Added "+newarticles+" new articles, "+existingarticles+" already existing and "+adderrors+" errors from "+articleslenght+" articles (total).")
    });
            
    } catch (error) {
        console.log("Update Error : See log for details");
        console.log(error);
    }
}

async function addArticle(id, articleData){
    try {
        const res = await firebase.firestore().collection('article').doc(id.toString()).set(articleData);

        if (res) {
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }

}


async function setlastArticleid(id){
    const res = await firebase.firestore().collection('numbers').doc("articles").set({lastid: id});
    return res;
}

async function getlastArticleid(){
    try {
        const ref = firebase.firestore().collection('numbers');
        const doc = await ref.doc("articles");
        let result;
        await doc.get().then(async function(doc) {
            if (doc.exists) {
                result = doc.data().lastid;
            } else {
                const res = await firebase.firestore().collection('numbers').doc("articles").set({lastid: 0});
                if (res) {
                    result = 0;
                }else{
                    result = null;
                }
            }
        }).catch(function(error) {
            console.log(error);
            result = null;
        });
        return result;           
    } catch (error) {
        console.log(error);
        return null;
    }
}


async function getActiveFeeds(callback){ //Returns active feeds list from db
    try{
        let feeds = [];

        const articlesRef = firebase.firestore().collection('articlefeed');
        const snapshot = await articlesRef.where('state', '==', true).get();

        if (snapshot.empty) {
        callback(null);
        }else{
        snapshot.forEach(doc => {
        feeds.push({id: doc.id, data:doc.data()});
        });
        callback(feeds);
        }

    }catch(error){
        console.log(error)
        callback(null);
    }
}

async function getFeed(feedid, callback){//Returns feed with id from db

    const articlesRef = firebase.firestore().collection('articlefeed');
    const doc = await articlesRef.doc(feedid);

    doc.get().then(function(doc) {
        if (doc.exists) {
            let newdoc = {id: doc.id, data:doc.data()}
            callback({success: true,doc: newdoc});
        } else {
            callback({success: false, error: "404"})
        }
    }).catch(function(error) {
        callback({success: false, error: error});
    });
}


async function getAllFeeds(callback){ //Returns all feeds list from db
    let feeds = [];
    const articlesRef = firebase.firestore().collection('articlefeed');
    const snapshot = await articlesRef.get();

    if (snapshot.empty) {
    console.log('No feeds found');
    callback(null);
    }
    snapshot.forEach(doc => {
        feeds.push({id: doc.id, data:doc.data()});
    });
    callback(feeds);
}


function getElem(obj ,path){
    try{
      if(obj != null && path != null && obj != undefined && path != undefined){
      const pathPieces = path.split('/');
      let res = obj;
      pathPieces.forEach(piece => {
        if(res != undefined && res != null && res != ""){
          res = res[piece];
        }
      });
      if (res != undefined) {
        return JSON.parse((JSON.stringify(res)));
      }else{
        return res;
      }
    }else{
      return null;
    }
  }catch(e){
    return null;
  }
}


module.exports = router;
