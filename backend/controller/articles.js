let express = require('express');
let router = express.Router();
const firebase = require('../firebaseConfig').firebaseApp;
const getArticlesFromFeeds = require('../services/articles/getArticlesFromFeeds');
const getArticleById = require('../services/articles/getArticleById');



router.get('', async function (request, response) { //TODO : Add params time etc...
    if (request.query.limit) {
        let limit = request.query.limit;
        let data = await getNLatestArticles(limit);
        if (data === null) {
            return response.status(404).json({msg : "No article found"});
        }
        return response.status(200).json({data: data});
    }else if(request.query.keywords){ //If user has keywords and if there are articles with those keywords
        try {
            let arr = request.query.keywords.split(',');
            let res = await getActiveArticlesByKW(arr);
            return response.status(200).json({data: res});
        } catch (error) {
            console.log(error)
            return response.status(error.status).json({msg: error.msg});
        }
    }else{
        /*let data = await getNLatestArticles(defaultArticlesLimit);
        if (data === null) {
            return response.status(404).json({msg : "No article found"});
        }*/
        return response.status(200).json({data: "data"});
    }



   
});




router.get('/:id',async function (request, response) {
    var id = request.params.id;
    if(!id)
    return response.status(400).send({ msg: "missing parameters" });

    try {
        var res = await getArticleById(id);
        return response.status(200).json(res);
    } catch (error) {
        return response.status(error.status).send({ msg: error.msg });
    }

});


router.delete('/:id',async function (request, response) {
    var id = request.params.id;
    if(!id)
    return response.status(400).send({ msg: "missing parameters" });

    let res = await deletearticle(id);
    if (res) {
        return response.status(200).json({msg: "Article deleted successfully"});
    }else{
        return response.status(404).json({msg: "An error occured"});
    }
});

async function getActiveArticlesByKW(keywords){

    return new Promise(async function(resolve, reject){

    try{
        let data = [];
        let keyworddata = [];
        

    getActiveFeeds(async function(userfeeds){ 
        if (userfeeds === null) {
            reject({status: 404, msg : "No active feed found"});
        }else{
                const j = await Promise.all( 
                userfeeds.map(async(feed) => {
                var list = await getArticlesFromFeeds(feed);
                    if (list != null) {
                        list.forEach(article => {
                        data.push(article);
                        });
                    }
                }));
                if (data.length == 0) {
                    reject({status: 404, msg : "No article found in any active feeds"});
                }

                data.forEach(article => {
                    let title = ""+article.data.title;
                    let description = ""+article.data.description;
                    let author = ""+article.data.author;
                    keywords.forEach(keyword => {
                        if ((title.toLowerCase().includes(keyword.toLowerCase()))||(description.toLowerCase().includes(keyword.toLowerCase()))||(author.toLowerCase().includes(keyword.toLowerCase()))) {
                            if (!keyworddata.some(item => item.id === article.id)) {
                                keyworddata.push(article);                          
                            }
                        }
                    });
                });
                if (keyworddata.length == 0) {
                    reject({status: 404, msg : "No article found"});
                }
            await keyworddata.sort((a, b) => parseFloat(b.data.date) - parseFloat(a.data.date));//Most recent to oldest
            resolve(keyworddata);
        }

     });
    }catch(error){
        reject({status: 500, msg: "Server error"});
    }

});
}



async function getAllArticles(){

    try{
        let data = [];        

    getActiveFeeds(async function(userfeeds){ 
        if (userfeeds === null) {
            reject({status: 404, msg : "No active feed found"});
        }else{
                const j = await Promise.all( 
                userfeeds.map(async(feed) => {
                var list = await getArticlesFromFeeds(feed);
                    if (list != null) {
                        list.forEach(article => {
                        data.push(article);
                        });
                    }
                }));
                if (data.length == 0) {
                    reject({status: 404, msg : "No article found in any active feeds"});
                }
            await data.sort((a, b) => parseFloat(b.data.date) - parseFloat(a.data.date));//Most recent to oldest
            resolve(data);
        }

     });
    }catch(error){
        reject({status: 500, msg: "Server error"});
    }

}


async function getNLatestArticles(number){ //3
    const lastid = (await getlastArticleid())-1;//10

    if (lastid === null || lastid === 0) {
        return null;
    }
    if (number>lastid) {
        number = lastid - 1;
    }
    let errorsnumber = 0;
    let data = [];
    for (let i = lastid; i > (lastid - number); i--) {
        try {
            let res = await getArticleById(i);
            data.push(res)
        } catch (error) {
            console.log(error);
            errorsnumber++;
        }
    }

    if (data.length > 0) {
        return data;
    }else{
        return null;
    }

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


async function getActiveFeeds(callback){ //Returns feeds list from db
    try {

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


            
    } catch (error) {
       callback(null);     
    }
}

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

module.exports = router;
