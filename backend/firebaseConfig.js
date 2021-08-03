const firebase = require('firebase-admin');
const serviceAccount = require('./private/serviceAccountKey');

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://thecountofmoney-11.firebaseio.com"
});

exports.firebaseApp = firebaseApp;
