let Gdax = require('gdax');
let CronJob = require('cron').CronJob;
let logger = require('./core/Logger');
let publicClient = new Gdax.PublicClient('BTC-EUR');

new CronJob('*/15 * * * * *', function () {
    publicClient.getProductOrderBook({'level': 1}, function (err, response, data) {
        let bestBid = 0;
        let bestAsk = 0;
        if (typeof data['bids'] != 'undefined' && typeof data['asks'] != 'undefined') {
            bestBid = parseFloat(data['bids'][0][0]); // selling order
            bestAsk = parseFloat(data['asks'][0][0]);  // buying order

            if (bestBid > bestAsk) {
                logger.log('long for ' + bestBid + ' short for' + bestAsk + ' = ' + (bestAsk - bestBid), 'log-wide.txt');
            }
            if ((bestAsk - bestBid) < 0) {
                logger.log('negative wide', 'log-wide.txt');
            }
        }
    });
}, null, true);

