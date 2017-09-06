let config = {};

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
    },
    awesome_oscillator: {
        thresholds: {
            down: -2,
            up: 2,
            // How many candle intervals should a trend persist
            // before we consider it real?
            persistence: 2
        }
    }
};

config.trade = {
    exchange: "gdax",
    base_currency: "LTC",
    quote_currency: "EUR",
    interval: 3600,
    trailing_loss: {
        interval: 14,
        weight: 2.9
    },
    wallet_percentage: 25
};

module.exports = config;