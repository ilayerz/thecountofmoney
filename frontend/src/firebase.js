import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyBwVg9HQAZSf1UDjXQoJeNOtWI3imjDtEE",
    authDomain: "thecountofmoney-11.firebaseapp.com",
    databaseURL: "https://thecountofmoney-11.firebaseio.com",
    projectId: "thecountofmoney-11",
    storageBucket: "thecountofmoney-11.appspot.com",
    messagingSenderId: "229187658352",
    appId: "1:229187658352:web:edfa4dd23a7bac36600ab5",
    measurementId: "G-HF4SZC2HKE"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

const cryptocurrency = db.collection('cryptocurrency');
const userSettings = db.collection('user-settings');

export {
    db,
    auth,
    cryptocurrency,
    userSettings
};