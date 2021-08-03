const firebase = require('../../firebaseConfig').firebaseApp;

module.exports = exports =

async function (feed){

    const items = [];

    return new Promise(async function(resolve, reject){

        const articlesRef = firebase.firestore().collection('article');
        const snapshot = await articlesRef.where('feed', '==', feed.id).get();
    
        if (snapshot.empty) {
            console.log("empty")
            resolve(null);
        }else{
            snapshot.forEach(doc => {
                items.push({id: doc.id, data:doc.data()}); //TODO Maybe add a source object with feed title and link
            });
            
            resolve(items);              
        }
                

    })


    }