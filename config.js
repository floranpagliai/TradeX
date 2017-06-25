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
    base_min_size: "0.01",
    base_max_size: "10000.00",
    quote_increment: "0.01"
};

config.trade = {
    interval: 3600 // 1h
};
module.exports = config;