let Gdax = require('gdax');
let fs = require('fs');
let tulind = require('tulind');
let logger = require('./Logger.js');
let dateFormat = require('dateformat');

const Account = require('./Account.js');
const ProductRates = require('./ProductRates.js');
let config = require("./config.js");

let publicClient = new Gdax.PublicClient(config.product.id);

let baseCurrencyAccount = new Account(0, config.product.base_currency, 0, 0, 0);
let quoteCurrencyAccount = new Account(0, config.product.quote_currency, 100, 100, 0);

let productRates = [];

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

function backtest() {
    publicClient.getProductHistoricRates({'granularity': config.trade.interval}, function (err, response, data) {
        data.reverse();

        let times = [];
        let lowPrices = [];
        let highPrices = [];
        let openPrices = [];
        let closePrices = [];
        let volumes = [];
        let lastClosePrice = 0;
        for (let i = 0; i < data.length; i++) {
            times.push(data[i][0]);
            lowPrices.push(data[i][1]);
            highPrices.push(data[i][2]);
            openPrices.push(data[i][3]);
            closePrices.push(data[i][4]);
            volumes.push(data[i][5]);
            productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);
            lastClosePrice = data[i][4];
            let date = dateFormat(new Date(data[i][0] * 1000), "dd/mm/yyyy HH:MM");
            let signal = getSignal();
            if (signal == 'BUY') {
                // logger.log(date + ': BUY' );
                buy((data[i][4] * 100 - 1) / 100);
            } else if (signal == 'SELL') {
                // logger.log(date + ': SELL');
                sell((data[i][4] * 100 + 1) / 100);
            } else {
                // logger.log(date + ': WAIT');
            }
            logger.log((quoteCurrencyAccount.available + baseCurrencyAccount.available * lastClosePrice) + '€');
        }

    });
}

function buy(price) {
    if (quoteCurrencyAccount.available > price * 0.01 && price > 0) {
        let params = {
            'price': price,
            'size': Math.floor(quoteCurrencyAccount.available / price * 10000) / 10000,  // BTC
            'product_id': config.product.id,
        };
        logger.log('Buy ' + params.size + ' at ' + params.price);
        // TODO: make a stop sell with price minus 2% or 5%
        baseCurrencyAccount.available += params.size;
        quoteCurrencyAccount.available -= params.size * price;
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
        logger.log('Buy ' + params.size + ' at ' + params.price);
        quoteCurrencyAccount.available += params.size * price;
        baseCurrencyAccount.available -= params.size;
    } else {
        logger.log('No bitcoin to sell.')
    }
}

backtest();