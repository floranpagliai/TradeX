let products = {};

products = {
    gdax: {
        'BTC-EUR': {
            id: 'BTC-EUR',
            base_currency: "BTC",
            quote_currency: "EUR",
            base_min_size: 0.01,
            base_max_size: 250,
            quote_increment: 0.01
        },
        'ETH-EUR': {
            id: 'ETH-EUR',
            base_currency: "ETH",
            quote_currency: "EUR",
            base_min_size: 0.01,
            base_max_size: 5000,
            quote_increment: 0.01
        },
        'LTC-EUR': {
            id: 'LTC-EUR',
            base_currency: "LTC",
            quote_currency: "EUR",
            base_min_size: 0.01,
            base_max_size: 1000000,
            quote_increment: 0.01
        }
        // TODO : add each products
    }
};

module.exports = products;