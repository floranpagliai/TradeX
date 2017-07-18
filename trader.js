let dateFormat = require('dateformat');
let tulind = require('tulind');
let CronJob = require('cron').CronJob;
let logger = require('./core/Logger.js');

const Account = require('./models/Account.js');
const ProductRates = require('./models/ProductRates.js');
const Trade = require('./models/Trade.js');
let config = require("./config.js");
let advisor = require('./strategies/Advisor');
let exchange = require("./exchanges/gdax");

let productRates = [];
let lastTime = null;
let activeTrade = null;

let historicRatesCallback = function (err, response, data) {
    if (typeof data === 'undefined' || productRates.lastTime >= data[0][0]) {
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
        // console.log(dateFormat(new Date(data[i][0] * 1000)) + advisor.advice(lowPrices, highPrices, openPrices, closePrices, volumes))
    }
    productRates = new ProductRates(times, lowPrices, highPrices, openPrices, closePrices, volumes);
    if (lastTime === null) {
        lowPrices.pop();
        highPrices.pop();
        openPrices.pop();
        closePrices.pop();
        volumes.pop();
        advisor.advice(lowPrices, highPrices, openPrices, closePrices, volumes);
    }
    trade();
};

function openPosition(side, size) {
    size = typeof size === 'undefined' ? 0 : size;
    if (side == 'LONG') {
        exchange.buy({size: size}, function (err, response, data) {
            if (typeof data['id'] !== 'undefined') {
                if (activeTrade !== null) {
                    activeTrade.openingOrderId = data['id'];
                    activeTrade.price = data['price'];
                    activeTrade.size = data['size'];
                } else {
                    activeTrade = new Trade(exchange.product, 'LONG', data['size'], data['price'], data['id']);
                }
            }
        });
    } else if (side == 'SHORT') {
        // TODO : implement margin trading
    }
}

function closePosition(size) {
    size = typeof size === 'undefined' ? 0 : size;
    if (activeTrade.side == 'LONG') {
        exchange.sell({size: size}, function (err, response, data) {
            if (typeof data['id'] !== 'undefined') {
                activeTrade.closingOrderId = data['id'];
            }
        });
    } else if (activeTrade.side == 'SHORT') {
        // TODO : implement margin trading closing
    }
}

function trade() {
    if (lastTime >= productRates.lastTime || typeof productRates.lastTime === 'undefined') {
        return null;
    }
    lastTime = productRates.lastTime;
    let tickDateStart = dateFormat(new Date((lastTime - config.trade.interval) * 1000), "HH:MM");
    let tickDateEnd = dateFormat(new Date(lastTime * 1000), "HH:MM");
    let advice = advisor.advice(productRates.lowPrices, productRates.highPrices, productRates.openPrices, productRates.closePrices, productRates.volumes);
    logger.log(tickDateStart + ' to ' + tickDateEnd + ' ' + advice);
    openPosition(advice);
    if (activeTrade != null && advice != 'WAIT' && advice != activeTrade.side) {
        closePosition();
    }
    updateTrailingLoss();
}

function updateTrailingLoss() {
    if (activeTrade !== null) {
        if (activeTrade.openingOrderStatus === 'DONE') {
            let averageRange = 0;
            tulind.indicators.atr.indicator([productRates.highPrices, productRates.lowPrices, productRates.closePrices], [config.trade.trailing_loss.interval], function (err, results) {
                averageRange = results[0][results[0].length - 1];
            });
            if (activeTrade.side == 'LONG') {
                let trailingPrice = productRates.lastLowPrice - (averageRange * config.trade.trailing_loss.weight);
                if (activeTrade.trailingLoss < trailingPrice) {
                    logger.log('Set trailing loss to ' + trailingPrice);
                    activeTrade.trailingLoss = trailingPrice;
                }
            } else if (activeTrade.side == 'SHORT') {
                let trailingPrice = productRates.lastHighPrice + (averageRange * config.trade.trailing_loss.weight);
                if (activeTrade.trailingLoss > trailingPrice) {
                    activeTrade.trailingLoss = trailingPrice;
                }
            }
        }
        if (activeTrade.trailingLoss !== null) {
            if ((activeTrade.side == 'LONG' && exchange.getBestBid() < activeTrade.trailingLoss) || (activeTrade.side == 'SHORT' && exchange.getBestAsk() > activeTrade.trailingLoss)) {
                logger.log('Activate stop loss ' + activeTrade.trailingLoss);
                if (activeTrade.openingOrderStatus !== 'DONE') {
                    exchange.cancelOrder(activeTrade.openingOrderId, function (err, response, data) {
                        activeTrade = null;
                    });
                } else if (activeTrade.closingOrderId == null) {
                    closePosition();
                }
            }
        }
    }
}

function updateActiveTrade() {
    if (activeTrade !== null) {
        if (activeTrade.openingOrderStatus !== 'DONE') {
            exchange.getOrder(activeTrade.openingOrderId, function (err, response, data) {
                let status = data['status'];
                let price = parseFloat(data['price']).toFixed(2);
                if (status == 'done') {
                    activeTrade.openingOrderStatus = 'DONE';
                } else {
                    if (activeTrade.side == advisor.trend.side) {
                        let bestPrice = activeTrade.side == 'LONG' ? exchange.getBestSellingPrice() : exchange.getBestBuyingPrice();
                        if (price != bestPrice) {
                            exchange.cancelOrder(activeTrade.openingOrderId, function (err, response, data) {
                                logger.log('Cancel order : ' + JSON.stringify(data));
                                if (typeof data[0] == activeTrade.openingOrderId) {
                                    activeTrade.openingOrderId = null;
                                }
                                openPosition(activeTrade.side);
                            });
                        }
                    } else {
                        exchange.cancelOrder(activeTrade.openingOrderId, function (err, response, data) {
                            activeTrade = null;
                        });
                    }
                }
            });
        }
        if (activeTrade.closingOrderId !== null && activeTrade.closingOrderStatus !== 'DONE') {
            exchange.getOrder(activeTrade.closingOrderId, function (err, response, data) {
                let status = data['status'];
                let price = parseFloat(data['price']).toFixed(2);
                if (status == 'done') {
                    activeTrade.closingOrderStatus = 'DONE'; // Useless for now
                    activeTrade = null;
                } else {
                    if (activeTrade.side != advisor.trend.side) {
                        let bestPrice = activeTrade.side == 'LONG' ? exchange.getBestSellingPrice() : exchange.getBestBuyingPrice();
                        if (price != bestPrice) {
                            exchange.cancelOrder(activeTrade.closingOrderId, function (err, response, data) {
                                logger.log('Cancel order closing : ' + JSON.stringify(data));
                                if (typeof data[0] == activeTrade.closingOrderId) {
                                    activeTrade.closingOrderId = null;
                                }
                                closePosition();
                            });
                        }
                    } else {
                        // Trend revert
                        exchange.cancelOrder(activeTrade.openingOrderId, function (err, response, data) {
                            activeTrade.closingOrderId = null;
                        });
                    }
                }
            });
        }
    }
}

advisor.init();
exchange.init();
activeTrade = new Trade('BTC-EUR', 'LONG', 0.08, 2035.89, 'test');
new CronJob('*/15 * * * * *', function () {
    exchange.update();
    exchange.getHistoricRates(historicRatesCallback);
}, null, true);

new CronJob('0 * * * * *', function () {
    updateActiveTrade();
}, null, true);

// TODO : save active trade with local json storage
// TODO : save filled size when cancel
// TODO : backtest

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
