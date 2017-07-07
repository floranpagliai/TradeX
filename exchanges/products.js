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
        }
    }
};

module.exports = products;