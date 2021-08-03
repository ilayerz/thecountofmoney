const firebase = require('../../firebaseConfig').firebaseApp;
const axios = require('axios');

exports.login = (request, response) => {
    const { email, password} = request.body;

    params = {
        email: email,
        password: password,
        returnSecureToken: true,
    };

    axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBwVg9HQAZSf1UDjXQoJeNOtWI3imjDtEE', params)
        .then(function (res) {
            response.status(200).json({
                message: "User login",
                user: res.data
            })
        })
        .catch(function(error) {
            return response.status(400).json({
                message: "Bad email or password !",
                error: error.message
            });
        });
};

exports.logout = (request, response) => {
    var idToken = request.header('authorization').slice(7);
    firebase.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;
            firebase.auth().revokeRefreshTokens(uid)
                .then(function () {
                    response.status(200).json({
                        message: "Logout succesfully",
                    })
                })
                .catch(function(error) {
                    return response.status(400).json({
                        message: "Not able to logout",
                        error: error.message
                    });
                });

        })
        .catch(function(error) {
            return response.status(400).json({
                message: "Not able to logout",
                error: error.message
            });
        });
};

exports.register = (request, response) => {
    const { email, password} = request.body;

    firebase.auth().createUser({
        email: email,
        password: password
    }).then(function(user) {
        response.status(200).json({
            message: "User created",
            user: user
        })
    })
        .catch(function(error) {
            return response.status(400).json({
                message: "User not created",
                code: error.code,
                error: error.message
            });
        });
};


createUserSetting = (userUid, email) => {
    return new Promise(async (resolve, reject) => {
        try {
            var userSettings = {
                user: userUid,
                nickname: email,
                default_currency: "EUR",
                crypto_currencies : [],
                list_keywords: [],
                role: "ROLE_USER"
            };
            firebase.firestore().collection('user-settings').add(userSettings);

            return resolve(userSettings)
        } catch (err) {
            return reject("UNABLE_TO_RETRIEVE_DATA");
        }
    });
};

modifyUserSetting = (userUid, userOriginal, user, docId) => {
    return new Promise(async (resolve, reject) => {
        try {
            var userNew = {
                user: userOriginal.docs[0].data().user,
                role: userOriginal.docs[0].data().role
            };

            if ("nickname" in user) {
                userNew.nickname = user.nickname;
            } else {
                userNew.nickname = userOriginal.docs[0].data().nickname;
            }

            if ("default_currency" in user) {
                userNew.default_currency = user.default_currency;
            } else {
                userNew.default_currency = userOriginal.docs[0].data().default_currency;
            }

            if ("crypto_currencies" in user) {
                userNew.crypto_currencies = user.crypto_currencies;
            } else {
                userNew.crypto_currencies = userOriginal.docs[0].data().crypto_currencies;
            }

            if ("list_keywords" in user) {
                userNew.list_keywords = user.list_keywords;
            } else {
                userNew.list_keywords = userOriginal.docs[0].data().list_keywords;
            }

            console.log(userNew);
            firebase.firestore().collection('user-settings').doc(docId).update(userNew);
            return resolve(userNew)
        } catch (err) {
            console.log(err);
            return reject("UNABLE_TO_RETRIEVE_DATA");
        }
    });
};

exports.getUserProfile = (request, response) => {
    var idToken = request.header('authorization').slice(7);

    firebase.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;
            firebase.auth().getUser(uid)
                .then(function(userRecord) {

                    let serviceCollection = firebase.firestore().collection('user-settings');
                    serviceCollection.where('user', '==', uid).get()
                        .then(userSettings => {
                            response.status(200).json({
                                message: "User info",
                                user: {
                                    uid: uid,
                                    email: userRecord.email,
                                    created: userRecord.metadata.creationTime,
                                    lastConnexion: userRecord.metadata.lastSignInTime,
                                    userSettings:
                                        {
                                            nickname: userSettings.docs[0].data().nickname,
                                            default_currency: userSettings.docs[0].data().default_currency,
                                            crypto_currencies: userSettings.docs[0].data().crypto_currencies,
                                            list_keywords: userSettings.docs[0].data().list_keywords,
                                            role: userSettings.docs[0].data().role
                                        }
                                },
                            })
                        })
                        .catch(error => {
                            createUserSetting(uid, userRecord.email)
                                .then(userSettings => {
                                    response.status(200).json({
                                        message: "User info (added)",
                                        user: {
                                            uid: uid,
                                            email: userRecord.email,
                                            created: userRecord.metadata.creationTime,
                                            lastConnexion: userRecord.metadata.lastSignInTime,
                                            userSettings: {
                                                nickname: userSettings.nickname,
                                                default_currency: userSettings.default_currency,
                                                crypto_currencies: userSettings.crypto_currencies,
                                                list_keywords: userSettings.list_keywords,
                                                role: userSettings.role
                                            }
                                        },
                                    })
                                })
                        })
                })
                .catch(function(error) {
                    return response.status(400).json({
                        message: "Error",
                        code: error.code,
                        error: error.message
                    });
                });
        }).catch(function(error) {
        return response.status(400).json({
            message: "Error",
            code: error.code,
            error: error.message
        });
    });
};


exports.modifyUserProfile = (request, response) => {
    var idToken = request.header('authorization').slice(7);
    const { userSettings } = request.body;
    const userSettingsRequest = userSettings;

    firebase.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;
            firebase.auth().getUser(uid)
                .then(function(userRecord) {

                    let serviceCollection = firebase.firestore().collection('user-settings');
                    serviceCollection.where('user', '==', uid).get()
                        .then(userSettingsOriginal => {
                            modifyUserSetting(uid, userSettingsOriginal, userSettingsRequest, userSettingsOriginal.docs[0].id)
                                .then(userSettings => {
                                    response.status(200).json({
                                        message: "User updated",
                                        user: {
                                            uid: uid,
                                            email: userRecord.email,
                                            created: userRecord.metadata.creationTime,
                                            lastConnexion: userRecord.metadata.lastSignInTime,
                                            userSettings: {
                                                nickname: userSettings.nickname,
                                                default_currency: userSettings.default_currency,
                                                crypto_currencies: userSettings.crypto_currencies,
                                                list_keywords: userSettings.list_keywords,
                                                role: userSettings.role
                                            }
                                        },
                                    })
                                })
                                .catch(error => {
                                    return response.status(400).json({
                                        message: "Error",
                                        error: error
                                    });
                                })
                        })
                        .catch(error => {
                            return response.status(400).json({
                                message: "Error 1",
                                code: error.code,
                                error: error.message
                            });
                        })
                })
                .catch(function(error) {
                    return response.status(400).json({
                        message: "Error 2",
                        code: error.code,
                        error: error.message
                    });
                });
        }).catch(function(error) {
        return response.status(400).json({
            message: "Error 3",
            code: error.code,
            error: error.message
        });
    });
};
