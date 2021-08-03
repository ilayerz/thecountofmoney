var express = require('express');
var router = express.Router();
var axios = require('axios')
var cryptocompare = require('./cryptocompare');
const firebase = require('../firebaseConfig').firebaseApp;

/**
 * GET /cryptos/toplist24h[?limit={int}&tsym={string}&page={int}]
 *  Returns a list of top cryptocurrencies
 *  according to their last 24h volume ranking
 */
router.get('/toplist24h', async function(req, res) {
    try {
        const cryptoList = await cryptocompare.getTopCryptoList24h(
            req.query.limit,
            req.query.tsym,
            req.query.page
        );

        return res.json(cryptoList);
    } catch (e) {
        console.error(e);
    }
});

/**
 * GET /cryptos/[?cmids={cm}]
 *  Get the list of crypto-currencies and their info, which is at least :
 *
 *  Full name
 *  current price
 *  opening price
 *  lowest price of the day
 *  highest price of the day
 *  URL image
 */
router.get('', async function (req, res) {
    try{
    let cmIds = req.query.cmids;
    let infos = await cryptocompare.getCryptosInfo(cmIds)
    if(infos == false)
        return res.status(400).send({ msg: "Parameters error" });

    let i = 0;
    for (let items of infos) {
        var docRef = await firebase.firestore().collection("cryptocurrency").doc(items.name);

        let doc = await docRef.get();
        if(doc.exists)  {
            items.name = doc.data().name
            items.image = doc.data().image
        } else {
            delete infos[i]
        }
        i++;
    }

    return res.json(infos);
    }catch(err){
        return res.status(500).send({ msg: "Unknown error" });
    }
})

/**
 * GET /cryptos/list
 *  Returns all available currencies (those selected by the admin) .
 */

router.get('/list', async function (req, res) { //TODO filter using user's preferences (favorite cryptos)
    try {
        const cryptos = await getCryptos();
        return res.status(200).json(cryptos);        
    } catch (error) {
        return res.status(500).json("Unknown error");        
    }

})

/**
 * GET /cryptos/{cmid}
 *  Returns information about a cryptocurrency.
 */
router.get('/:cmid', function (req, res) {
    let cmId = req.params.cmid;
    if(!cmId)
        return res.status(400).send({ msg: "missing parameters" });
    try {     
        var docRef =  firebase.firestore().collection("cryptocurrency").doc(cmId);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                return res.json(doc.data());
            } else {
                return res.status(404).send({ msg: "cryptocurrency not found" });
            }
        }).catch(function(error) {
            return res.status(400).send({ msg: error });
        });
    } catch (error) {
        return res.status(500).send({ msg: "Unknown error" });
    }
})

/**
 *  GET /cryptos/:cmid/history/:period
 *  cmid: cryptocurrency Id. period: daily, hourly or minute. User MUST be logged in. Provides the price
 *  history of a cryptocurrency. For each period:
 *  -> opening, highest, lowest and closing exchange rates
 *  Depending on the periods, the history is shorter or longer
 *  -> daily: Last 60 days, so 60 periods a day
 *  -> hourly: 48 last hours, so 48 periods of one hour
 *  -> minute: last 2 hours, so 60 periods of one minute
 */
router.get('/:cmid/history/:period', async function (req, res) {

    //TODO AJOUTER LE CHECK USER

    let cmId = req.params.cmid;
    let period = req.params.period;

    if(!period ||!cmId)
        return res.status(400).send({ error: "missing parameters" });

    if(period != "daily" && period != "hourly" && period != "minute")
        return res.status(400).send({ error: "period parameter can only be 'daily', 'hourly' or 'minute'" });

    let result = await cryptocompare.getCryptoInfoByPeriod(cmId, period)

    if(result == false)
        return res.status(400).send({ error: "currency not found" });

    return res.json(result.Data);
})


/**
 *  POST /cryptos
 *  User MUST be logged in as well as the ADMINISTRATOR. Add a cryptocurrency to your platform. A
 *  form must be attached to the request and contain at least the cryptocurrency code, their full name
 *  and a URL for the image to which it represents.
 */
router.post('', async function (req, res) {

    //TODO AJOUTER LE CHECK ADMINISTRATOR

    let cmCode = req.body.cmCode
    let name = req.body.name
    let image = req.body.image

    if(!image || !cmCode || !name){
        return res.status(400).send({ error: "missing parameters" });
    }
    let check = await cryptocompare.checkCurrencyExist(cmCode)

    if(check == false)
        return res.status(404).send({ error: "cryptocurrency not found" });

    firebase.firestore().collection("cryptocurrency").doc(cmCode).set({
        cmCode: cmCode,
        name: name,
        image: image
    })
        .then(function() {
            return res.json({"cmCode": cmCode, "name": name, "image": image});
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            return res.status(400).json({ msg: "Error writing document" });
        });

})

/**
 *  DELETE /cryptos/:cmid
 *  cmid: cryptocurrency Id. User MUST be logged in as well as the ADMINISTRATOR.
 *  Deletes a cryptocurrency (meaning that your platform does not know this currency anymore.)
 */
router.delete('/:cmid', async function (request, response) {


    //TODO AJOUTER LE CHECK ADMINISTRATOR

    let cmId = request.params.cmid;
    if(!cmId)
        return response.status(400).json({ msg: "missing parameters" });
    try{
        const ref = firebase.firestore().collection("cryptocurrency")
        const doc = await ref.doc(cmId);
        const res = await doc.get();
        if(res.exists){
                const doc1 = await ref.doc(cmId);
                await doc1.delete();
                const doc2 = await ref.doc(cmId);
                const res2 = await doc2.get();
                if (!res2.exists) {
                    return response.status(200).json({msg : "Currency deleted successfully"})
                }else{
                    return response.status(500).json({msg : "Currency couldn't be deleted"})
                }
        }else{
            return response.status(404).send({ msg: "This currency doesn't exist" });
        }
    }catch(err){
        return response.status(500).send({ msg: "An unknown error occured" });
    }
})











async function getCryptos(){

    let cryptos = [];

    const cryptosRef = firebase.firestore().collection('cryptocurrency');
    const snapshot = await cryptosRef.get();

    if (snapshot.empty) {
    console.log('No currencies found');
    return(null);
    }

    snapshot.forEach(doc => {
     cryptos.push({id: doc.id, data:doc.data()});
    });
    return(cryptos);
}

module.exports = router;