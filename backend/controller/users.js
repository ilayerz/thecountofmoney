var express = require('express');
var router = express.Router();
const firebase = require('../firebaseConfig').firebaseApp;
const userSettings = firebase.firestore().collection('user-settings');

router.patch('/:id', async function(req, res) {
    try {
        const userRef = userSettings.doc(req.params.id);
        const {
            firstName,
            lastName,
            email,       // TODO update auth credentials as well
            nickname,
            oldPassword, // TODO update auth credentials as well
            newPassword  // TODO update auth credentials as well
        } = req.body;

        if (!userRef) {
            return res.status(404).send({ msg: 'User not found' });
        }

        const userData = (await userRef.get()).data();
        const updatedUserData = {
            first_name: (firstName?.trim()) || userData.first_name,
            last_name: (lastName?.trim()) || userData.last_name,
            nickname: (nickname?.trim()) || userData.nickname,
        };

        // const user = await firebase.auth().getUser(req.params.id);
        // console.log('user', user);

        await userRef.update(updatedUserData);

        return res.status(200).send({ msg: 'User has been updated' });
    } catch (e) {
        console.error(e);
        return res.status.send(e);
    }

});

router.post('/:id/addCrypto', async function(req, res) {
    try {
        const userRef = userSettings.doc(req.params.id);
        const { cmCode, image, name } = req.body.crypto;

        if (!userRef) {
            return res.status(404).send({ msg: 'User not found' });
        }
        if (!cmCode || !image || !name) {
            return res.status(400).send({ msg: 'Bad format, missing properties' });
        }

        const { crypto_currencies } = (await userRef.get()).data();
        const isDuplicate = crypto_currencies.some(crypto => crypto.cmCode == cmCode);

        if (isDuplicate) {
            return res.status(400).send({ msg: 'Cryptocurrencies already added' });
        }

        await userRef.update({
            crypto_currencies: [
                ...crypto_currencies,
                {
                    cmCode,
                    image,
                    name
                }
            ]
        });

        return res.status(200).send({ msg: 'Cryptocurrencies added' });
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

router.delete('/:id/deleteCrypto/:cmCode', async function(req, res) {
    try {
        const userRef = userSettings.doc(req.params.id);
        const { cmCode } = req.params;

        if (!userRef) {
            return res.status(404).send({ msg: 'User not found' });
        }
        if (!cmCode) {
            return res.status(400).send({ msg: 'Bad format, missing parameters' });
        }

        const { crypto_currencies } = (await userRef.get()).data();
        const index = crypto_currencies.findIndex((crypto) => crypto.cmCode == cmCode);
        crypto_currencies.splice(index, 1);

        await userRef.update({
            crypto_currencies: crypto_currencies
        });

        return res.status(200).send({ msg: 'Cryptocurrencies deleted' });
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

router.post('/:id/addKeyword', async function(req, res) {
    try {
        const userRef = userSettings.doc(req.params.id);
        const { keywords } = req.body;

        if (!userRef) {
            return res.status(404).send({ msg: 'User not found' });
        }
        if (!keywords) {
            return res.status(400).send({ msg: 'Bad format, missing properties' });
        }

        const { list_keywords } = (await userRef.get()).data();

        keywords.forEach((word) => {
            if (!list_keywords.some(listWord => listWord == word) && word.length > 0) {
                list_keywords.push(word);
            }
        });

        await userRef.update({
            list_keywords: list_keywords
        });

        return res.status(200).send(list_keywords);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

router.post('/:id/deleteKeyword', async function(req, res) {
    try {
        const userRef = userSettings.doc(req.params.id);
        const { keyword } = req.body;

        console.log(req.body);

        if (!userRef) {
            return res.status(404).send({ msg: 'User not found' });
        }
        if (!keyword) {
            return res.status(400).send({ msg: 'Bad format, missing properties' });
        }

        const { list_keywords } = (await userRef.get()).data();
        const index = list_keywords.indexOf(keyword);
        if (index >= 0) {
            list_keywords.splice(index, 1);
            await userRef.update({
                list_keywords: list_keywords
            });
            return res.status(200).send(list_keywords);
        } else {
            return res.status(404).send({ msg: 'Word not found' });
        }

    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

module.exports = router;