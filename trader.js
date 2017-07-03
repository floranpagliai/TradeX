let Gdax = require('gdax');
let dateFormat = require('dateformat');
let tulind = require('tulind');
let CronJob = require('cron').CronJob;
let logger = require('./Logger.js');

const Account = require('./Account.js');
const ProductRates = require('./ProductRates.js');
const Trade = require('./Trade.js');
let config = require("./config.js");


// Init accounts
let baseCurrencyAccount = new Account(0, config.product.base_currency, 0, 0, 0);
let quoteCurrencyAccount = new Account(0, config.product.quote_currency, 0, 0, 0);

let productRates = [];
let lastTime = null;
let bestBid = 0;
let bestAsk = 0;
let activeTrade = null;

let publicClient = new Gdax.PublicClient(config.product.id);
let authedClient = new Gdax.AuthenticatedClient(config.api.key, config.api.secret, config.api.passphrase);


let orderBookCallback = function (err, response, data) {
    if (typeof data['bids'] != 'undefined' && typeof data['asks'] != 'undefined') {
        bestBid = parseFloat(data['bids'][0][0]); // device to buy
        bestAsk = parseFloat(data['asks'][0][0]);  // device to sell
    }
};

let historicRatesCallback = function (err, response, data) {
    if (!data instanceof Array) {
        logger.log('[ERROR] tradeCallback data is not array');
    }
    if (typeof data[0] === 'undefined' || productRates.lastTime >= data[0][0]) {
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
    }
    productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);
    trade();
};

let accountsCallback = function (err, response, data) {
    if (data instanceof Array) {
        for (let account of data) {
            if (account)
                if (account['currency'] == config.product.quote_currency) {
                    quoteCurrencyAccount.update(account['balance'], account['available'], account['hold']);
                } else if (account['currency'] == config.product.base_currency) {
                    baseCurrencyAccount.update(account['balance'], account['available'], account['hold']);
                }
        }
    }
};

function getSignal() {
    let histogram = 0;
    let histogramBefore = 0;
    let histogramValues = [];
    tulind.indicators.macd.indicator([productRates.closePrices], [12, 26, 9], function (err, results) {
        histogram = results[2][results[2].length - 1];
        histogramBefore = results[2][results[2].length - 2];
        histogramValues = results[2].reverse();
    });
    if (histogram > config.trade.macd.thresholds.up && histogramBefore < config.trade.macd.thresholds.up) {
        let persistence = getHistogramPersistence(histogramValues, false);
        if (persistence >= config.trade.macd.thresholds.persistence) {

            return 'BUY';
        }
    }  else if (histogram < config.trade.macd.thresholds.down && histogramBefore > config.trade.macd.thresholds.down) {
        let persistence = getHistogramPersistence(histogramValues, true);
        if (persistence >= config.trade.macd.thresholds.persistence) {

            return 'SELL';
        }
    }

    return 'WAIT';
}

function getHistogramPersistence(histogramValues, checkPositive) {
    let persistence = 0;
    for (let value of histogramValues.slice(1)) {
        if (checkPositive && value <= 0) {
            break;
        } else if (!checkPositive && value >= 0) {
            break;
        }
        persistence++;
    }

    return persistence;
}

function buy(price) {
    if (quoteCurrencyAccount.available > price * config.product.base_min_size && price > 0) {
        let params = {
            'price': price,
            'size': Math.floor(quoteCurrencyAccount.available / price * 100) / 100,  // BTC
            'product_id': config.product.id,
        };
        authedClient.buy(params, function (err, response, data) {
            if (typeof data['id'] !== 'undefined') {
                logger.log(data['id']);
                // TODO : use web
                activeTrade = new Trade(params.product_id, data['id'], 'buy', params.size, params.price);
            }
        });
        logger.log('Buy ' + params.size + ' at ' + params.price);
    } else {
        logger.log('No money for buying.');
    }
}

function sell(price) {
    if (baseCurrencyAccount.available > config.product.base_min_size && price > 0) {
        let params = {
            'price': price,
            'size': baseCurrencyAccount.available,  // BTC
            'product_id': config.product.id,
        };
        authedClient.sell(params, function (err, response, data) {

        });
        logger.log('Sell ' + params.size + ' at ' + params.price);
    } else {
        logger.log('No bitcoin to sell.')
    }
}

function trade() {
    if (lastTime >= productRates.lastTime || typeof productRates.lastTime === 'undefined') {
        return null;
    }
    lastTime = productRates.lastTime;
    let tickDateStart = dateFormat(new Date((lastTime - config.trade.interval) * 1000), "HH:MM");
    let tickDateEnd = dateFormat(new Date(lastTime * 1000), "HH:MM");
    let signal = getSignal();
    if (signal == 'BUY') {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' BUY');
        buy((bestAsk - 0.01).toFixed(2));
    } else if (signal == 'SELL') {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' SELL');
        sell((bestBid + 0.01).toFixed(2));
    } else {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' WAIT');
    }
    if (signal == 'BUY' || signal == 'SELL') {
        logger.log(quoteCurrencyAccount.available + 'eur');
        logger.log(baseCurrencyAccount.available + 'btc or ' + baseCurrencyAccount.available * bestAsk + 'eur');
    }
}

new CronJob('*/15 * * * * *', function () {
    authedClient.getAccounts(accountsCallback);
    publicClient.getProductHistoricRates({'granularity': config.trade.interval}, historicRatesCallback);
}, null, true);

new CronJob('*/5 * * * * *', function () {
    publicClient.getProductOrderBook({'level': 1}, orderBookCallback);
    if (activeTrade !== null) {
        let averageRange = 0;
        tulind.indicators.atr.indicator([productRates.highPrices, productRates.lowPrices, productRates.closePrices], [14], function (err, results) {
            averageRange = results[0][results[0].length - 1];
        });
        logger.log('Active trade average range='+averageRange);
        if (activeTrade.side == 'buy' && activeTrade.startingPrice - averageRange > productRates.lastLowPrice) {
            logger.log('Activate buy stop loss ' + activeTrade.startingPrice - averageRange);
            activeTrade = null;
        } else if (activeTrade.side == 'sell' && activeTrade.startingPrice + averageRange < productRates.lastHighPrice) {
            logger.log('Activate sell stop loss ' + activeTrade.startingPrice + averageRange);
            activeTrade = null;
        }
    }
}, null, true);
