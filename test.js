let Gdax = require('gdax');
let fs = require('fs');
let _stockPrices = [];
let _macd = [];
let publicClient = new Gdax.PublicClient('BTC-EUR');

publicClient.getProductHistoricRates({'granularity': 60*5}, function (err, response, data) {
    let state = 'WAIT';
    data.reverse();
    _stockPrices = [];
    _macd = [];
    // fs.unlink('data.csv');
    let test = 0;
    fs.appendFileSync('data.csv', 'timestamp' + '\t' + 'price' + '\t' + 'macd' + '\t' + 'signal' + '\t' + 'histogram' +  '\t' + 'state' + '\n');
    let i = 0;
    for (i = 0, len = data.length; i < len; i++) {
        _stockPrices.push(data[i][4]);
        let macd = MACD(12, 26);
        _macd.push(macd);
        let signalLine = exponentialMovingAverage(9, _macd);
        let macdHistogram = macd - signalLine;
        if (macd >= signalLine && test == 0) {
            state = 'BUY';
            test = 1;
        }
        else if (macd <= signalLine && test == 1) {
            state = 'SELL';
            test = 0;
        } else {
            state = 'WAIT';
        }
        fs.appendFileSync('data.csv', (new Date(data[i][0] * 1000)).toLocaleString() + '\t' + data[i][4] + '\t' + macd + '\t' + signalLine + '\t' + macdHistogram + '\t' + state +'\n');
    }
});

function exponentialMovingAverage(days, stockPrices) {
    let exponentialMovingAverage = 0;
    let coeff = 0;
    let i = stockPrices.length - days;

    for (let n = 0; n < days; n++) {
        exponentialMovingAverage += stockPrices[i++] * (n + 1);
        coeff += (n + 1);
    }
    exponentialMovingAverage /= coeff;
    return exponentialMovingAverage;
}

/**
 * @return {number}
 */
function MACD(EMAShort, EMALong) {
    return exponentialMovingAverage(EMAShort, _stockPrices) - exponentialMovingAverage(EMALong, _stockPrices);
}