let fs = require('fs');
let dateFormat = require('dateformat');

module.exports = {
    log: function (log, logfile = 'log.txt') {
        let path = 'var/log/';
        log = '[' + dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss") + '] ' + log;
        console.log(log);
        fs.appendFileSync(logfile, log + '\n');
    }
};