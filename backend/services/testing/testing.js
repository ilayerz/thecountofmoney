const firebase = require('../../firebaseConfig').firebaseApp;

exports.databaseCheck = (_, response) => {
    firebase.firestore().collection('database-check').doc('default')
        .get().then(reactions => {
        return response.status(200).json({
            message: "Database found",
            action: reactions.data()
        })
    }).catch( error => {
        return response.status(400).json({
            message: "Database not found",
            error: error
        })
    });
};
