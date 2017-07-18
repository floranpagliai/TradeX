let advisor = require('./strategies/Advisor');
let exchange = require("./exchanges/gdax");
let dateFormat = require('dateformat');
const Account = require('./models/Account.js');

let baseCurrencyAccount = new Account(0, 'BTC', 0, 0, 0);
let quoteCurrencyAccount = new Account(0, 'EUR', 100, 100, 0);

advisor.init();
exchange.init();

let historicRatesCallback = function (err, response, data) {
    if (typeof data === 'undefined') {
        return null;
    }
    data.reverse();
    let times = [];
    let lowPrices = [];
    let highPrices = [];
    let openPrices = [];
    let closePrices = [];
    let volumes = [];
    for (let i = 0; i < data.length; i++) {
        times.push(data[i][0]);
        lowPrices.push(data[i][1]);
        highPrices.push(data[i][2]);
        openPrices.push(data[i][3]);
        closePrices.push(data[i][4]);
        volumes.push(data[i][5]);
        let advice = advisor.advice(lowPrices, highPrices, openPrices, closePrices, volumes);
        if (advice == 'LONG') {
            baseCurrencyAccount.available = baseCurrencyAccount.available + ( quoteCurrencyAccount.available / data[i][4]);
            quoteCurrencyAccount.available = quoteCurrencyAccount.available - (quoteCurrencyAccount.available / data[i][4]);
        } else if (advice == 'SHORT') {
            quoteCurrencyAccount.available = (quoteCurrencyAccount.available/data[i][4]) * data[i][4];
            baseCurrencyAccount.available = baseCurrencyAccount.available - (quoteCurrencyAccount.available/data[i][4]);
        }
        // TODO : paper trading exchange

        // console.log(dateFormat(new Date(data[i][0] * 1000)) + ' ' + advice);
    }
    console.log(quoteCurrencyAccount.available + (baseCurrencyAccount.available * data[data.length -1][4]) + '€');
};

exchange.getHistoricRates(historicRatesCallback);