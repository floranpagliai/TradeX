let tulind = require('tulind');
let settings = require("../config.js").advisor.MACD;

let method = {};

method.init = function () {
    this.trend = {
        side: null,
        duration: 0,
        persisted: false,
        adviced: false
    };
};

method.advice = function (closingPrices) {
    let histogramValues = [];
    tulind.indicators.macd.indicator([closingPrices], [settings.short, settings.long, settings.signal], function (err, results) {
        histogramValues = results[2].reverse();
    });
    if (histogramValues[0] > settings.thresholds.up) {
        if (this.trend.side !== 'long') {
            this.trend = {
                duration: 0,
                persisted: false,
                side: 'long',
                adviced: false
            };
        }
        this.trend.duration++;
        if (this.trend.duration >= settings.thresholds.persistence) {
            this.trend.persisted = true;
        }
        if (this.trend.persisted && !this.trend.adviced) {
            this.trend.adviced = true;

            return 'LONG';
        }
    } else if (histogramValues[0] < settings.thresholds.down) {
        if (this.trend.side !== 'down') {
            this.trend = {
                duration: 0,
                persisted: false,
                side: 'down',
                adviced: false
            };
        }
        this.trend.duration++;
        if (this.trend.duration >= settings.thresholds.persistence) {
            this.trend.persisted = true;
        }
        if (this.trend.persisted && !this.trend.adviced) {
            this.trend.adviced = true;

            return 'SHORT';
        }
    }

    return 'WAIT';
};

module.exports = method;