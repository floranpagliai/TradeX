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
    if (typeof data[0] === 'undefined' || productRates.lastTime == data[0][0]) {
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
        productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);
        getSignal();
    }
    productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);
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
        if (strength >= config.trade.macd.histogram_buy) {

            return 'BUY';
        }
    }
    else if (macd < signal && macdBefore > signalBefore) {
        let strength = getHistogramStrength(histogramValues, true);
        if (strength >= config.trade.macd.histogram_sell) {

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
    if (quoteCurrencyAccount.available > price * config.product.base_min_size && price > 0) {
        let params = {
            'price': price,
            'size': Math.floor(quoteCurrencyAccount.available / price * 100) / 100,  // BTC
            'product_id': config.product.id,
        };
        authedClient.buy(params, function (err, response, data) {
            if (typeof data['id'] !== 'undefined') {
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
    if (productRates.lastTime == lastTime) {
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
    publicClient.getProductOrderBook({'level': 1}, orderBookCallback);
    publicClient.getProductHistoricRates({'granularity': config.trade.interval}, historicRatesCallback);
}, null, true);

new CronJob('0 */1 * * * *', function () {
    trade();
    if (activeTrade !== null) {
        let averageRange = 0;
        tulind.indicators.atr.indicator([productRates.highPrices, productRates.lowPrices, productRates.closePrices], [14], function (err, results) {
            averageRange = results[0][results[0].length - 1];
        });
        if (activeTrade.side == 'buy' && activeTrade.startingPrice - averageRange > bestAsk) {
            console.log('Activate buy stop loss ' + activeTrade.startingPrice - averageRange);
            activeTrade = null;
        } else if (activeTrade.side == 'sell' && activeTrade.startingPrice + averageRange < bestBid) {
            console.log('Activate sell stop loss ' + activeTrade.startingPrice + averageRange);
            activeTrade = null;
        }
    }
}, null, true);
