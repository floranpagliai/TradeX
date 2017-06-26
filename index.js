let Gdax = require('gdax');
let fs = require('fs');
let tulind = require('tulind');
let CronJob = require('cron').CronJob;

const Account = require('./Account.js');
const ProductRates = require('./ProductRates.js');
let config = require("./config.js");


// Init accounts
let baseCurrencyAccount = new Account(0, config.product.base_currency, 0, 0, 0);
let quoteCurrencyAccount = new Account(0, config.product.quote_currency, 0, 0, 0);

let productRates = [];

let lastTime = null;
let bestBid = 0;
let bestAsk = 0;
let previousSignal = 0;

let publicClient = new Gdax.PublicClient(config.product.id);
let authedClient = new Gdax.AuthenticatedClient(config.api.key, config.api.secret, config.api.passphrase);

let tradeCallback = function (err, response, data) {
    if (!data instanceof Array) {
        log('[ERROR] tradeCallback data is not array');
    }
    if (typeof data[0] === 'undefined' || lastTime == data[0][0]) {
        return null;
    }
    lastTime = data[0][0];
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
        productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);
        getSignal();
    }
    productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);

    let tickDateStart = (new Date((lastTime-config.trade.interval) * 1000)).toLocaleString('fr-fr', { hour: "numeric", minute: "numeric" });
    let tickDateEnd = (new Date(lastTime * 1000)).toLocaleString('fr-fr', { hour: "numeric", minute: "numeric" });

    let signal = getSignal();
    if (signal == 'BUY') {
        log(tickDateStart + ' to ' + tickDateEnd + + ' BUY');
        buy((bestAsk * 100 - 1) / 100);
    } else if (signal == 'SELL') {
        log(tickDateStart + ' to ' + tickDateEnd + ' SELL');
        sell((bestBid * 100 + 1) / 100);
    } else {
        log(tickDateStart + ' to ' + tickDateEnd + ' WAIT');
    }
    if (signal == 'BUY' || signal == 'SELL') {
        log(quoteCurrencyAccount.available + 'eur');
        log(baseCurrencyAccount.available + 'btc or ' + baseCurrencyAccount.available * bestAsk + 'eur');
    }
};

let accountsCallback = function (err, response, data) {
    if (data instanceof Array) {
        for (let account of data) {
            if (account)
                if (account['currency'] == config.product.quote_currency) {
                    quoteCurrencyAccount.update(account['id'], account['currency'], account['balance'], account['available'], account['hold']);
                } else if (account['currency'] == config.product.base_currency) {
                    baseCurrencyAccount.update(account['id'], account['currency'], account['balance'], account['available'], account['hold']);
                }
        }
    }
};

let orderCallback = function (err, response, data) {
    log(JSON.stringify(data));
};

function getSignal() {
    let macd = 0;
    let signal = 0;
    let histogram = 0;
    tulind.indicators.macd.indicator([productRates.closePrices], [12, 26, 9], function (err, results) {
        macd = results[0][results[0].length - 1];
        signal = results[1][results[1].length - 1];
        histogram = results[2][results[2].length - 1];
    });
    if (macd >= signal && previousSignal == 0) {
        // TODO : check for same histogram size for 14 day
        previousSignal = 1;

        return 'BUY';
    }
    else if (macd <= signal && previousSignal == 1) {
        previousSignal = 0;

        return 'SELL';
    }

    return 'WAIT';
}

function buy(price) {
    if (quoteCurrencyAccount.available > price * 0.01 && price > 0) {
        let params = {
            'price': price,
            'size': Math.floor(quoteCurrencyAccount.available / stockPrice * 10000) / 10000,  // BTC
            'product_id': config.product.id,
        };
        authedClient.buy(params, orderCallback);
        log('Buy ' + params.size + ' for ' + params.price);

        // baseCurrencyAccount.available = baseCurrencyAccount.available + ( quoteCurrencyAccount.available / stockPrice);
        // quoteCurrencyAccount.available = quoteCurrencyAccount.available - (quoteCurrencyAccount.available / stockPrice);
    } else {
        log('No money for buying.');
    }
}

function sell(price) {
    if (baseCurrencyAccount.available > 0.01 && price > 0) {
        let params = {
            'price': price,
            'size': baseCurrencyAccount.available,  // BTC
            'product_id': config.product.id,
        };
        authedClient.sell(params, orderCallback);
        log('Buy ' + params.size + ' for ' + params.price);
        // quoteCurrencyAccount.available = (quoteCurrencyAccount.startingBalance/stockPrice) * stockPrice;
        // baseCurrencyAccount.available = baseCurrencyAccount.available - (quoteCurrencyAccount.startingBalance/stockPrice);
    } else {
        log('No bitcoin to sell.')
    }
}

function log(log) {
    log = '[' + (new Date()).toLocaleString('fr-FR') +  '] ' + log;
    console.log(log);
    fs.appendFileSync('log.txt', log + '\n');
}


function trade() {
    authedClient.getAccounts(accountsCallback);
    publicClient.getProductHistoricRates({'granularity': config.trade.interval}, tradeCallback);
}

function book() {
    publicClient.getProductOrderBook({'level': 1}, function (err, response, data) {
        if (typeof data['bids'] != 'undefined' && typeof data['asks'] != 'undefined') {
            bestBid = parseFloat(data['bids'][0][0]); // device to buy
            bestAsk = parseFloat(data['asks'][0][0]);  // device to sell
        }
    });
}

new CronJob('0 */1 * * * *', function () {
    book();
    trade();
}, null, true);