let MACD = require('./MACD');
let ao = require('./AwesomeOscillator');

let method = {};

method.init = function () {
    this.trend = {
        side: null,
        adviced: false
    };
    MACD.init();
    ao.init();
};

method.advice = function (lowPrices, highPrices, openPrices, closePrices, volumes) {
    MACD.advice(closePrices);
    ao.advice(highPrices, lowPrices);
    if (MACD.trend.side == ao.trend.side && MACD.trend.adviced && ao.trend.adviced && MACD.trend.duration >= ao.trend.duration) {
        if (MACD.trend.side != this.trend.side) {
            this.trend = {
                side: MACD.trend.side,
                adviced: true
            };
            return MACD.trend.side;
        }
    }

    return 'WAIT';
};

module.exports = method;