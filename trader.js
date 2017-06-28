let Gdax = require('gdax');
let dateFormat = require('dateformat');
let tulind = require('tulind');
let CronJob = require('cron').CronJob;
let logger = require('./Logger.js');

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
        // console.log((new Date(data[i][0] * 1000)).toLocaleString('fr-fr') + ' ' + getSignal());
    }
    productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);

    let tickDateStart = dateFormat(new Date((lastTime - config.trade.interval) * 1000), "HH:MM");
    let tickDateEnd = dateFormat(new Date(lastTime * 1000), "HH:MM");

    let signal = getSignal();
    if (signal == 'BUY') {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' BUY');
        buy((bestAsk * 100 - 1) / 100);
    } else if (signal == 'SELL') {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' SELL');
        sell((bestBid * 100 + 1) / 100);
    } else {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' WAIT');
    }
    if (signal == 'BUY' || signal == 'SELL') {
        logger.log(quoteCurrencyAccount.available + 'eur');
        logger.log(baseCurrencyAccount.available + 'btc or ' + baseCurrencyAccount.available * bestAsk + 'eur');
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
    logger.log(JSON.stringify(data));
};

function getSignal() {
    let macd = 0;
    let signal = 0;
    let histogram = 0;
    let macdBefore = 0;
    let signalBefore = 0;
    let histogramValues = [];
    tulind.indicators.macd.indicator([productRates.closePrices], [12, 26, 9], function (err, results) {
        macd = results[0][results[0].length - 1];
        signal = results[1][results[1].length - 1];
        histogram = results[2][results[2].length - 1];
        macdBefore = results[0][results[0].length - 2];
        signalBefore = results[1][results[1].length - 2];
        histogramValues = results[2].reverse();
    });

    if (macd > signal && macdBefore < signalBefore) {
        let strength = getHistogramStrength(histogramValues, false);
        if (strength >= config.trade.macd.histogram_strength_requirement) {

            return 'BUY';
        }
    }
    else if (macd < signal && macdBefore > signalBefore) {
        let strength = getHistogramStrength(histogramValues, true);
        if (strength >= config.trade.macd.histogram_strength_requirement) {

            return 'SELL';
        }
    }

    return 'WAIT';
}

function getHistogramStrength(histogramValues, checkPositive) {
    let strength = 0;
    for (let value of histogramValues.slice(1)) {
        if (checkPositive && value <= 0) {
            break;
        } else if (!checkPositive && value >= 0) {
            break;
        }
        strength++;
    }

    return strength;
}

function buy(price) {
    if (quoteCurrencyAccount.available > price * 0.01 && price > 0) {
        let params = {
            'price': price,
            'size': Math.floor(quoteCurrencyAccount.available / price * 10000) / 10000,  // BTC
            'product_id': config.product.id,
        };
        // authedClient.buy(params, orderCallback);
        logger.log('Buy ' + params.size + ' for ' + params.price);
        // TODO: make a stop sell with price minus 2% or 5%
        console.log('Stop order at 2%=' + (params.price - params.price * 0.02).toFixed(2) + ' and 5%=' + (params.price - params.price * 0.05).toFixed(2));

        // baseCurrencyAccount.available = baseCurrencyAccount.available + ( quoteCurrencyAccount.available / stockPrice);
        // quoteCurrencyAccount.available = quoteCurrencyAccount.available - (quoteCurrencyAccount.available / stockPrice);
    } else {
        logger.log('No money for buying.');
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
        logger.log('Buy ' + params.size + ' for ' + params.price);
        // quoteCurrencyAccount.available = (quoteCurrencyAccount.startingBalance/stockPrice) * stockPrice;
        // baseCurrencyAccount.available = baseCurrencyAccount.available - (quoteCurrencyAccount.startingBalance/stockPrice);
    } else {
        logger.log('No bitcoin to sell.')
    }
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