let Gdax = require('gdax');
let logger = require('../core/Logger.js');
let config = require("../config.js");
let products = require("./products").gdax;

let bestBid = 0;
let bestAsk = 0;
let spread = 0;

let method = {};

method.init = function () {
    this.use_sandbox = false;

    this.key = config.exchanges.gdax.key;
    this.secret = config.exchanges.gdax.secret;
    this.passphrase = config.exchanges.gdax.passphrase;

    this.product = [config.trade.base_currency, config.trade.quote_currency].join('-').toUpperCase();

    this.gdax_public = new Gdax.PublicClient(this.product, this.use_sandbox ? 'https://api-public.sandbox.gdax.com' : undefined);
    this.gdax = new Gdax.AuthenticatedClient(this.key, this.secret, this.passphrase, this.use_sandbox ? 'https://api-public.sandbox.gdax.com' : undefined);
};

method.getHistoricRates = function (callback) {
    let result = function (err, response, data) {
        callback(err, response, data)
    };

    this.gdax_public.getProductHistoricRates({'granularity': config.trade.interval}, result);
};

method.getBestOrders = function () {
    let result = function (err, response, data) {
        if (typeof data['asks'] !== 'undefined' && typeof data['bids'] !== 'undefined') {
            bestAsk = parseFloat(data['asks'][0][0]);  // device to short (red)
            bestBid = parseFloat(data['bids'][0][0]); // device to long (green)
            spread = (bestAsk - bestBid).toFixed(2);
        }
    };

    this.gdax_public.getProductOrderBook({'level': 1}, result);
};

method.getAccounts = function (callback) {
    let result = function (err, response, data) {
        let quoteCurrencyAccount = null;
        let baseCurrencyAccount = null;
        for (let account of data) {
            if (account['currency'] == config.trade.quote_currency) {
                quoteCurrencyAccount = account;
            } else if (account['currency'] == config.trade.base_currency) {
                baseCurrencyAccount = account;
            }
        }
        callback(quoteCurrencyAccount, baseCurrencyAccount)
    };

    this.gdax.getAccounts(result);
};

method.buy = function (size, callback) {
    let result = function (err, response, data) {
        callback(err, response, data)
    };
    let params = {
        'price': this.getBestBuyingPrice(),
        'size': size,  // BTC
        'product_id': this.product,
        'time_in_force': 'GTT',
        'cancel_after': 'hour',
        'post_only': true // TODO ; config
    };
    // quoteCurrencyAccount.available > price * products[this.product].base_min_size
    if (params.price > 0) {
        this.gdax.buy(params, result);
        logger.log('Buy ' + params.size + ' at ' + params.price + ' (bestAsk=' + bestAsk + ', bestBid=' + bestBid + ')');
    }
};

method.sell = function (size, callback) {
    let result = function (err, response, data) {
        callback(err, response, data)
    };
    let params = {
        'price': this.getBestSellingPrice(),
        'size': size,  // BTC
        'product_id': this.product,
        'time_in_force': 'GTT',
        'cancel_after': 'hour',
        'post_only': true // TODO ; config
    };

    // baseCurrencyAccount.available > products[this.product].base_min_size
    if (price > 0) {
        this.gdax.sell(params, result);
        logger.log('Sell ' + params.size + ' at ' + params.price + ' (bestAsk=' + bestAsk + ', bestBid=' + bestBid + ')');
    }
};

method.cancelOrder = function (orderId, callback) {
    let result = function (err, response, data) {
        callback(err, response, data)
    };

    this.gdax.cancelOrder(orderId, result);
};

method.getOrder = function (orderId, callback) {
    let result = function (err, response, data) {
        callback(err, response, data)
    };

    this.gdax.getOrder(orderId, result);
};

method.getBestBuyingPrice = function() {
    let res = parseFloat(bestBid - products[this.product].quote_increment);
    if (spread == products[this.product].quote_increment) {
        res = parseFloat(bestBid - spread);
    }
    return res.toFixed(2);
};

method.getBestSellingPrice = function() {
    let res = parseFloat(bestBid + products[this.product].quote_increment);
    if (spread == products[this.product].quote_increment) {
        res = parseFloat(bestBid + spread);
    }
    return res.toFixed(2);
};

method.getBestBid = function () {
   return bestBid;
};

method.getBestAsk = function () {
    return bestAsk;
};


module.exports = method;