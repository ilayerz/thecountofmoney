const { parseString } = require('xml2js');

const firebase = require('../../firebaseConfig').firebaseApp;

module.exports = exports =

async function (id){

    return new Promise(async function(resolve, reject){
        try {
            id = ""+ id;
            const articlesRef = firebase.firestore().collection('article');
            const snapshot = await articlesRef.doc(id).get();
        
            if (!snapshot.exists) {
                reject({status:404, msg: "Article not found"});
            }else{
                resolve({id: snapshot.id, data:snapshot.data()});                  
            }   
        } catch (error) {
            console.log(error)
            reject({status:500, msg: "An error occured"})
        }
    })


    }