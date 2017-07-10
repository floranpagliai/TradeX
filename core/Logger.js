let fs = require('fs');
let dateFormat = require('dateformat');

module.exports = {
    log: function (log, logfile = 'log.txt') {
        let path = 'var/logs/';
        log = '[' + dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss") + '] ' + log;
        console.log(log);
        // TODO : log by product id
        fs.appendFileSync(path + logfile, log + '\n');
    }
};