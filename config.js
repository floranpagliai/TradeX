let config = {};

config.api = {
    key: 'fd126a612be49446435b69aa9599d2bf',
    secret: 'fMQZ8jfUE2f97K2of76zuKCnqX9gxj5EWZk8YLk1o+0kwM+6NSov34IJZgATsx2EU9cm3IW43w+ByVLy68+LYw==',
    passphrase: 'eq3pksvqn46',
};

config.product = {
    id: 'BTC-EUR',
    base_currency: "BTC",
    quote_currency: "EUR",
    base_min_size: 0.01,
    base_max_size: 250,
    quote_increment: 0.01
};

config.advisor = {
    MACD: {
        short: 12,
        long: 21,
        signal: 9,
        thresholds: {
            down: -0.25,
            up: 0.25,
            // How many candle intervals should a trend persist
            // before we consider it real?
            persistence: 1
        }
    }
};

config.trade = {
    interval: 60*5,
    trailing_loss: {
        interval: 14
    }
};

module.exports = config;