let fs = require('fs');
let dateFormat = require('dateformat');
let product = null;

module.exports = {

    init: function (productName) {
        product =  productName;
    },
    log: function (log, logfile = 'log.txt') {
        let path = 'var/logs/';
        let data = '[' + dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss") + ']';
        if (product !== null) {
            data = data + '[' + product + ']';
        }
        console.log(data + ' ' + log);
        fs.appendFileSync(path + logfile, log + '\n');
    }
};