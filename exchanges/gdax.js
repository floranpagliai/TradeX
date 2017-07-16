let Gdax = require('gdax');
let logger = require('../core/Logger.js');
const Account = require('../models/Account.js');
let config = require("../config.js");
let products = require("./products").gdax;

let bestBid = 0;
let bestAsk = 0;
let spread = 0;
let baseCurrencyAccount = null;
let quoteCurrencyAccount = null;

let method = {};

method.init = function () {
    this.use_sandbox = false;

    this.key = config.exchanges.gdax.key;
    this.secret = config.exchanges.gdax.secret;
    this.passphrase = config.exchanges.gdax.passphrase;

    this.product = [config.trade.base_currency, config.trade.quote_currency].join('-').toUpperCase();

    baseCurrencyAccount = new Account(0, config.trade.base_currency, 0, 0, 0);
    quoteCurrencyAccount = new Account(0, config.trade.quote_currency, 0, 0, 0);
    this.getAccounts(function (quoteCurrencyData, baseCurrencyData) {
        quoteCurrencyAccount.update(quoteCurrencyData['balance'], quoteCurrencyData['available'], quoteCurrencyData['hold']);
        baseCurrencyAccount.update(baseCurrencyData['balance'], baseCurrencyData['available'], baseCurrencyData['hold']);
    });

    this.gdax_public = new Gdax.PublicClient(this.product, this.use_sandbox ? 'https://api-public.sandbox.gdax.com' : undefined);
    this.gdax = new Gdax.AuthenticatedClient(this.key, this.secret, this.passphrase, this.use_sandbox ? 'https://api-public.sandbox.gdax.com' : undefined);
};

method.update = function () {
    this.getBestOrders();
    this.getAccounts(function (quoteCurrencyData, baseCurrencyData) {
        quoteCurrencyAccount.update(quoteCurrencyData['balance'], quoteCurrencyData['available'], quoteCurrencyData['hold']);
        baseCurrencyAccount.update(baseCurrencyData['balance'], baseCurrencyData['available'], baseCurrencyData['hold']);
    });
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
        if (typeof data === 'undefined') {
            return null;
        }
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

method.buy = function (parameters, callback) {
    let size = parameters.size !== 0 ? parameters.size : Math.floor(quoteCurrencyAccount.available / this.getBestBuyingPrice() * 100) / 100;
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
    if (params.price > 0 && quoteCurrencyAccount.available > params.price * products[this.product].base_min_size) {
        this.gdax.buy(params, result);
        logger.log('Buy ' + params.size + ' at ' + params.price + ' (bestAsk=' + bestAsk + ', bestBid=' + bestBid + ')');
    }
};

method.sell = function (parameters, callback) {
    let size = parameters.size !== 0 ? parameters.size : baseCurrencyAccount.available;
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

    if (params.price > 0 && baseCurrencyAccount.available > products[this.product].base_min_size) {
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