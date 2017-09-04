let Gdax = require('gdax');
let logger = require('../core/Logger.js');
const Account = require('../models/Account.js');
let exchanges = require("../exchanges.js");
let products = require("./products").gdax;

let bestBid = 0;
let bestAsk = 0;
let spread = 0;
let baseCurrencyAccount = null;
let quoteCurrencyAccount = null;

let base_currency = null;
let quote_currency = null;
let trade_interval = null;
let wallet_percentage = null;

let method = {};

method.init = function (config) {
    this.use_sandbox = false;

    this.key = exchanges.gdax.key;
    this.secret = exchanges.gdax.secret;
    this.passphrase = exchanges.gdax.passphrase;

    this.product = [config.base_currency, config.quote_currency].join('-').toUpperCase();
    base_currency = config.base_currency;
    quote_currency = config.quote_currency;
    trade_interval = config.interval;
    wallet_percentage = config.wallet_percentage;

    this.gdax_public = new Gdax.PublicClient(this.product, this.use_sandbox ? 'https://api-public.sandbox.gdax.com' : undefined);
    this.gdax = new Gdax.AuthenticatedClient(this.key, this.secret, this.passphrase, this.use_sandbox ? 'https://api-public.sandbox.gdax.com' : undefined);

    baseCurrencyAccount = new Account(0, base_currency, 0, 0, 0);
    quoteCurrencyAccount = new Account(0, quote_currency, 0, 0, 0);
    this.getAccounts(function (quoteCurrencyData, baseCurrencyData) {
        quoteCurrencyAccount.update(quoteCurrencyData['balance'], quoteCurrencyData['available'], quoteCurrencyData['hold']);
        baseCurrencyAccount.update(baseCurrencyData['balance'], baseCurrencyData['available'], baseCurrencyData['hold']);
    });
};

method.update = function () {
    this.getAccounts(function (quoteCurrencyData, baseCurrencyData) {
        quoteCurrencyAccount.update(quoteCurrencyData['balance'], quoteCurrencyData['available'], quoteCurrencyData['hold']);
        baseCurrencyAccount.update(baseCurrencyData['balance'], baseCurrencyData['available'], baseCurrencyData['hold']);
    });
    this.getBestOrders();
};

method.getProducts = function (callback) {
    this.gdax_public.getProducts(callback);
};

method.getHistoricRates = function (callback) {
    let result = function (err, response, data) {
        callback(err, response, data)
    };

    this.gdax_public.getProductHistoricRates({'granularity': trade_interval}, result);
};

method.getBestOrders = function () {
    let result = function (err, response, data) {
        if (data !== null) {
            bestAsk = parseFloat(data['asks'][0][0]);  // device to short (red)
            bestBid = parseFloat(data['bids'][0][0]); // device to long (green)
            spread = (bestAsk - bestBid).toFixed(2);
        }
    };

    this.gdax_public.getProductOrderBook({'level': 1}, result);
};

method.getAccounts = function (callback) {
    let result = function (err, response, data) {
        if (data !== null && data instanceof Array) {
            let quoteCurrencyAccount = null;
            let baseCurrencyAccount = null;
            for (let account of data) {
                if (account['currency'] == quote_currency) {
                    quoteCurrencyAccount = account;
                } else if (account['currency'] ==base_currency) {
                    baseCurrencyAccount = account;
                }
            }
            callback(quoteCurrencyAccount, baseCurrencyAccount)
        }
    };

    this.gdax.getAccounts(result);
};

method.buy = function (parameters, callback) {
    let available = quoteCurrencyAccount.available * wallet_percentage / 100;
    let size = parameters.size !== 0 ? parameters.size : Math.floor(available / this.getBestBuyingPrice() * 100) / 100;
    let result = function (err, response, data) {
        logger.log(JSON.stringify(data));
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
    if (params.price > 0 && params.size > products[this.product].base_min_size) {
        this.gdax.buy(params, result);
        logger.log('Buy ' + params.size + ' at ' + params.price + ' (bestAsk=' + bestAsk + ', bestBid=' + bestBid + ')');
    } else {
        logger.log('Price or size is invalid');
    }
};

method.sell = function (parameters, callback) {
    let size = parameters.size !== 0 ? parameters.size : baseCurrencyAccount.available;
    let result = function (err, response, data) {
        logger.log(JSON.stringify(data));
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

    if (params.price > 0 && params.size > products[this.product].base_min_size) {
        this.gdax.sell(params, result);
        logger.log('Sell ' + params.size + ' at ' + params.price + ' (bestAsk=' + bestAsk + ', bestBid=' + bestBid + ')');
    } else {
        logger.log('Price or size is invalid');
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

method.getBestBuyingPrice = function () {
    let res = parseFloat(bestAsk - products[this.product].quote_increment);

    return res.toFixed(2);
};

method.getBestSellingPrice = function () {
    let res = parseFloat(bestBid + products[this.product].quote_increment);

    return res.toFixed(2);
};

method.getBestBid = function () {
    return bestBid;
};

method.getBestAsk = function () {
    return bestAsk;
};


module.exports = method;