var axios = require('axios')
const firebase = require('../firebaseConfig').firebaseApp;
const dotenv = require("dotenv");
dotenv.config();
const API = process.env.CRYPTOCOMPARE_API_KEY;

exports.checkCurrencyExist = async function (crypto) {

    let response =  await axios.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+crypto+'&tsyms=USD,EUR&api_key='+API)
    if(response.data.Response == 'Error') {
        return false
    }
    return true
}

exports.getCryptosInfo = async function (cryptos) {
    let response =  await axios.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+cryptos+'&tsyms=EUR&api_key='+API)
    if(response.data.Response == 'Error') {
        return false
    }
    let arr = [];

    await Object.entries(response.data.RAW).forEach(await function (item) {
        arr.push({
            "name": item[0],
            "currentPrice": item[1].EUR.PRICE,
            "openingPrice": item[1].EUR.OPENDAY,
            "lowestPrice": item[1].EUR.LOWDAY,
            "highestPrice": item[1].EUR.HIGHDAY,
            "image": "blblb"
        })
    })

    return arr
}


exports.getCryptoInfoByPeriod = async function (crypto, period) {
    let periodToUrl = "histoday";
    let limit = "60";
    switch (period){
        case "daily":
            periodToUrl = "histoday";
            limit = "60";
            break;
        case "hourly":
            periodToUrl = "histohour";
            limit = "48"
            break;
        case "minute":
            periodToUrl = "histominute";
            limit = "120"
            break;
    }
    let response =  await axios.get('https://min-api.cryptocompare.com/data/v2/'+periodToUrl+'?fsym='+crypto+'&tsym=EUR&limit='+limit+'&api_key='+API)
    if(response.data.Response == 'Error') {
        return false
    }
    return response.data.Data
}

exports.getTopCryptoList24h = async function(limit = 100, tsym = 'USD', page = 0) {
    const response = await axios.get(
        'https://min-api.cryptocompare.com/data/top/totalvolfull' +
        `?limit=${limit}` +
        `&tsym=${tsym}` +
        `&page=${page}` +
        `&api_key=${API}`
    );

    if (response.data.Response === 'Error') {
        console.error(response.data);
        return {
            Response: 'Error',
            Message: response.data.Message
        };
    }

    return await Promise.all(
        response.data.Data.map(async (info) => {
            return {
                id: info.CoinInfo.Id,
                cmCode: info.CoinInfo.Name,
                name: info.CoinInfo.FullName,
                image: info.CoinInfo.ImageUrl,
            };
        })
    );
}