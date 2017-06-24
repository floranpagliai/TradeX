let Gdax = require('gdax');

let endpoint = 'https://api-public.sandbox.gdax.com';
let device1 = 'BTC';
let device2 = 'EUR';
let product = device1+'-'+device2;
let interval = 60*5;

let eurWallet = 1000;
let btcWallet = 0;
let _stockPrices = [];
let _macd = [];
let state = 'WAIT';
let lastTime = null;
let bestBid = 0;
let bestAsk = 0;

let publicClient = new Gdax.PublicClient(product);
let authedClient = new Gdax.AuthenticatedClient('fd126a612be49446435b69aa9599d2bf', 'fMQZ8jfUE2f97K2of76zuKCnqX9gxj5EWZk8YLk1o+0kwM+6NSov34IJZgATsx2EU9cm3IW43w+ByVLy68+LYw==', 'eq3pksvqn46');

class Account {
    constructor(id, currency, balance, available, hold) {
        this._id = id;
        this._currency = currency;
        this._balance = balance;
        this._startingBalance = balance;
        this._available = available;
        this._hold = hold;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get currency() {
        return this._currency;
    }

    set currency(value) {
        this._currency = value;
    }

    get balance() {
        return this._balance;
    }

    set balance(value) {
        this._balance = value;
    }

    get available() {
        return this._available;
    }

    set available(value) {
        this._available = value;
    }

    get hold() {
        return this._hold;
    }

    set hold(value) {
        this._hold = value;
    }

    get startingBalance() {
        return this._startingBalance;
    }

    set startingBalance(value) {
        return this._startingBalance = value;
    }

    update(id, currency, balance, available, hold) {
        this._id = id;
        this._currency = currency;
        this._balance = balance;
        this._available = available;
        this._hold = hold;
    }
}

let callback = function (err, response, data) {
    data.reverse();
    _stockPrices = [];
    _macd = [];
    let i = 0;
    for (i = 0, len = data.length; i < len; i++) {
        _stockPrices.push(data[i][4]);
        // console.log((new Date(data[i][0] * 1000)).toLocaleString());
        getSignal(true);
    }
    i = i -1;
    if (lastTime < data[i][0]) {
        lastTime = data[i][0];
        let date = (new Date(data[i][0] * 1000)).toLocaleString();
        let log = date + '[low='+data[i][1]+']'+'[high='+data[i][2]+']'+'[open='+data[i][3]+']'+'[close='+data[i][4]+']';
        let signal = getSignal();
        if (signal == 'BUY' ) {
            console.log(log + ': BUY');
            buy(bestBid)
        } else if (signal == 'SELL') {
            console.log(log + ': SELL');
            sell(bestAsk)
        } else {
            console.log(log + ': WAIT');
        }
    }
    console.log(eurWallet.available + 'eur');
    console.log(btcWallet.available + 'btc or ' + btcWallet.available * data[i][4] + 'eur');
};

let accountsCallback = function (err, response, data) {

    for (let account of data) {
        if (account['currency'] == eurWallet.currency) {
            eurWallet.update(account['id'],account['currency'],account['balance'],account['available'],account['hold']);
        } else if (account['currency'] == btcWallet.currency) {
            btcWallet.update(account['id'],account['currency'],account['balance'],account['available'],account['hold']);
        }
    }
};

let orderCallback = function (err, response, data) {
    console.log(data);
};

function getSignal(saveState = false) {
    let macd = MACD(12, 26);
    _macd.push(macd);
    let signalLine = exponentialMovingAverage(9, _macd);
    let macdHistogram = macd - signalLine;

    if (macd >= signalLine) {
        if (state != 'BUY') {
            if (saveState) {
                state = 'BUY';
            }

            return 'BUY';
        }
    }
    else if (macd <= signalLine) {
        if (state != 'SELL') {
            if (saveState) {
                state = 'SELL';
            }

            return 'SELL';
        }
    }

    return 'WAIT';
}

function buy(stockPrice) {
    if (eurWallet.available > stockPrice * 0.01 && stockPrice > 0) {
        let params = {
            'price': (stockPrice - 0.01).toFixed(2),
            'size': (eurWallet.available/stockPrice).toFixed(6),  // BTC
            'product_id': product,
        };
        authedClient.buy(params, orderCallback);
        // btcWallet.available = btcWallet.available + ( eurWallet.available / stockPrice);
        // eurWallet.available = eurWallet.available - (eurWallet.available / stockPrice);
    } else {
        console.log('No money for buying.')
    }
    state = 'BUY';
}

function sell(stockPrice) {
    if (btcWallet.available > 0.01 && stockPrice > 0) {
        let params = {
            'price': (stockPrice + 0.01).toFixed(2),
            'size': btcWallet.available,  // BTC
            'product_id': product,
        };
        authedClient.sell(params, orderCallback);
        // eurWallet.available = (eurWallet.startingBalance/stockPrice) * stockPrice;
        // btcWallet.available = btcWallet.available - (eurWallet.startingBalance/stockPrice);
    } else {
        console.log('No bitcoin to sell.')
    }
    state = 'SELL';
}

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

// Init accounts
btcWallet = new Account(0, device1, 0, 0, 0);
eurWallet = new Account(0, device2, 0, 0, 0);


function trade() {
    authedClient.getAccounts(accountsCallback);
    publicClient.getProductHistoricRates({'granularity': interval}, callback);
}

function book() {
    publicClient.getProductOrderBook({'level': 1}, function (err, response, data) {
        bestBid = parseFloat(data['bids'][0][0]); // device to buy
        bestAsk = parseFloat(data['asks'][0][0]);  // device to sell

        console.log('best bid='+bestBid+' best ask='+bestAsk);
    });
}


book();
trade();
setInterval(function() {
    book();
    trade()
}, 100000);


// publicClient.getProducts(function (err, response, data) {
//     console.log(data);
// });
/**
 * Au lancement récup du capital dispo
 * Lors d'une action je génére un ordre liquide, si refusé je recupère la meilleure offre et j'en fait une meilleure.
 *
 * Pour les euros arrondir Math.floor(x*10)/10, pour les bitcoin Math.floor(x100000000)/100000000
 */