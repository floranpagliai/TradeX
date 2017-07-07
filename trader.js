let Gdax = require('gdax');
let dateFormat = require('dateformat');
let tulind = require('tulind');
let CronJob = require('cron').CronJob;
let logger = require('./Logger.js');

const Account = require('./Account.js');
const ProductRates = require('./ProductRates.js');
const Trade = require('./Trade.js');
let config = require("./config.js");
let MACD = require('./strategies/MACD');


// Init accounts
let baseCurrencyAccount = new Account(0, config.product.base_currency, 0, 0, 0);
let quoteCurrencyAccount = new Account(0, config.product.quote_currency, 0, 0, 0);

let productRates = [];
let lastTime = null;
let bestBid = 0;
let bestAsk = 0;
let spread = 0;
let activeTrade = null;

let publicClient = new Gdax.PublicClient(config.product.id);
let authedClient = new Gdax.AuthenticatedClient(config.api.key, config.api.secret, config.api.passphrase);

let orderBookCallback = function (err, response, data) {
    if (!data instanceof Array) {
        logger.log('[ERROR] orderBookCallback data is not array');
    }
    if (typeof data['bids'] != 'undefined' && typeof data['asks'] != 'undefined') {
        bestAsk = parseFloat(data['asks'][0][0]);  // device to short (red)
        bestBid = parseFloat(data['bids'][0][0]); // device to long (green)
        spread = (bestAsk - bestBid).toFixed(2);
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
    if (lastTime === null) {
        MACD.advice(closePrices)
    }
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

function getBestBuyingPrice() {
    if (spread == config.product.quote_increment) {
        return (bestAsk - spread).toFixed(2)
    }
    return (bestAsk - config.product.quote_increment).toFixed(2);
}

function getBestSellingPrice() {
    if (spread == config.product.quote_increment) {
        return (bestBid + spread).toFixed(2)
    }
    return (bestBid + config.product.quote_increment).toFixed(2);
}

function long(price) {
    if (quoteCurrencyAccount.available > price * config.product.base_min_size && price > 0) {
        let params = {
            'price': price,
            'size': Math.floor(quoteCurrencyAccount.available / price * 100) / 100,  // BTC
            'product_id': config.product.id,
            'time_in_force': 'GTT',
            'cancel_after': 'hour',
            'post_only': true
        };
        authedClient.buy(params, function (err, response, data) {
            logger.log(JSON.stringify(data));
            if (typeof data['id'] !== 'undefined') {
                // TODO : use web to track when order is filled and create trade
                // use watch to re execute order if canceled and same trend
                activeTrade = new Trade(params.product_id, data['id'], 'long', params.size, params.price);
            }
        });
        logger.log('Buy ' + params.size + ' at ' + params.price + ' (bestAsk=' + bestAsk + ', bestBid=' + bestBid + ')');
    } else {
        logger.log('No money for buying.');
    }
}

function short(price) {
    if (baseCurrencyAccount.available > config.product.base_min_size && price > 0) {
        let params = {
            'price': price,
            'size': baseCurrencyAccount.available,  // BTC
            'product_id': config.product.id,
            'post_only': true
        };
        authedClient.sell(params, function (err, response, data) {
            logger.log(JSON.stringify(data));
        });
        logger.log('Sell ' + params.size + ' at ' + params.price + ' (bestAsk=' + bestAsk + ', bestBid=' + bestBid + ')');
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
    let advice = MACD.advice(productRates.closePrices);
    if (advice == 'LONG') {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' LONG');
        long(getBestBuyingPrice());
    } else if (advice == 'SHORT') {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' SHORT');
        // short(getBestSellingPrice);
    } else {
        logger.log(tickDateStart + ' to ' + tickDateEnd + ' WAIT');
    }
    if (advice == 'LONG' || advice == 'SHORT') {
        logger.log(quoteCurrencyAccount.available + 'eur');
        logger.log(baseCurrencyAccount.available + 'btc or ' + baseCurrencyAccount.available * bestAsk + 'eur');
    }
    updateTrailingLoss();
}

function updateTrailingLoss() {
    if (activeTrade !== null) {
        let averageRange = 0;
        tulind.indicators.atr.indicator([productRates.highPrices, productRates.lowPrices, productRates.closePrices], [config.trade.trailing_loss.interval], function (err, results) {
            averageRange = results[0][results[0].length - 1];
        });
        if (activeTrade.side == 'long') {
            let trailingPrice = productRates.lastLowPrice - (averageRange * 1.9);
            if (activeTrade.trailingLoss < trailingPrice) {
                logger.log('Set trailing loss to ' + trailingPrice);
                activeTrade.trailingLoss = trailingPrice;
            }
        } else if (activeTrade.side == 'short') {
            let trailingPrice = productRates.lastHighPrice + (averageRange * 1.9);
            if (activeTrade.trailingLoss > trailingPrice) {
                activeTrade.trailingLoss = trailingPrice;
            }
        }
    }
}

function watchTrailingLoss() {
    if (activeTrade !== null) {
        if (activeTrade.side == 'long') {
            if (activeTrade.trailingLoss !== null && bestBid < activeTrade.trailingLoss) {
                logger.log('Activate long stop loss ' + activeTrade.trailingLoss);
                authedClient.cancelOrder(activeTrade.orderId, function (err, response, data) {
                    logger.log(JSON.stringify(data));
                });
                short(getBestSellingPrice());
                activeTrade = null;
                // TODO : closing long trade function
            }
        } else if (activeTrade.side == 'short') {
            if (activeTrade.trailingLoss !== null && bestAsk > activeTrade.trailingLoss) {
                logger.log('Activate short stop loss ' + activeTrade.trailingLoss);
                // TODO ; closing short trade function
            }
        }
    }
}

MACD.init();
new CronJob('*/5 * * * * *', function () {
    publicClient.getProductOrderBook({'level': 1}, orderBookCallback);
    watchTrailingLoss();
}, null, true);

new CronJob('*/15 * * * * *', function () {
    authedClient.getAccounts(accountsCallback);
    publicClient.getProductHistoricRates({'granularity': config.trade.interval}, historicRatesCallback);
}, null, true);


// let express = require('express');
//
// let app = express();
//
// app.get('/', function(req, res) {
//     let histogramValues = [];
//     tulind.indicators.macd.indicator([productRates.closePrices], [12, 26, 9], function (err, results) {
//         // histogram = results[2][results[2].length - 1];
//         // histogramBefore = results[2][results[2].length - 2];
//         histogramValues = results[2];
//     });
//     let data = [];
//     for (let i = 0; i < histogramValues.length; i++) {
//         data.push({
//             times: dateFormat(new Date(productRates.times[i] * 1000), "dd/mm/yyyy HH:MM"),
//             histogram: histogramValues[i]
//         });
//     }
//     res.render('macd.ejs', {histogramValues: data});
// });
//
// app.listen(80);
