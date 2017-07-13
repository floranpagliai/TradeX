let tulind = require('tulind');
let settings = require("../config.js").advisor.awesome_oscillator;

let method = {};

method.init = function () {
    this.trend = {
        side: null,
        duration: 0,
        persisted: false,
        adviced: false
    };
};

method.advice = function (high, low) {
    let aoValues = [];
    tulind.indicators.ao.indicator([high, low], [], function (err, results) {
        aoValues = results[0].reverse();
    });
    if (aoValues[0] > settings.thresholds.up) {
        if (this.trend.side !== 'LONG') {
            this.trend = {
                duration: 0,
                persisted: false,
                side: 'LONG',
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
    } else if (aoValues[0] < settings.thresholds.down) {
        if (this.trend.side !== 'SHORT') {
            this.trend = {
                duration: 0,
                persisted: false,
                side: 'SHORT',
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