let Gdax = require('gdax');
let fs = require('fs');
let tulind = require('tulind');

const Account = require('./Account.js');
const ProductRates = require('./ProductRates.js');
let config = require("./config.js.dist");

let publicClient = new Gdax.PublicClient(config.product.id);

let baseCurrencyAccount = new Account(0, config.product.base_currency, 0, 0, 0);
let quoteCurrencyAccount = new Account(0, config.product.quote_currency, 100, 0, 0);

let productRates = [];

function getSignal() {
    let macd = 0;
    let signal = 0;
    let histogram = 0;
    tulind.indicators.macd.indicator([productRates.closePrices], [12, 26, 9], function(err, results) {
        macd = results[0][results[0].length-1];
        signal = results[1][results[1].length-1];
        histogram = results[2][results[2].length-1];
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

function backtest() {
    publicClient.getProductHistoricRates({'granularity': config.trade.interval}, function (err, response, data) {
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
        if (lastTime < times[times.length - 1]) {
            lastTime = times[times.length - 1];
            let date = (new Date(lastTime * 1000)).toLocaleString('fr-fr');
            let signal = getSignal();
            if (signal == 'BUY') {
                log(date + ': BUY' );
                buy((bestAsk * 100 - 1) / 100);
            } else if (signal == 'SELL') {
                log(date + ': SELL');
                sell((bestBid * 100 + 1) / 100);
            } else {
                log(date + ': WAIT');
            }
            if (signal == 'BUY' || signal == 'SELL') {
                log(quoteCurrencyAccount.available + 'eur');
                log(baseCurrencyAccount.available + 'btc or ' + baseCurrencyAccount.available * bestAsk + 'eur');
            }
        }
    });
}

backtest();