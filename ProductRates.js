class ProductRates {
    constructor(times, lowPrices, highPrices, openPrices, closePrices, volumes) {
        this._times = times;
        this._lowPrices = lowPrices;
        this._highPrices = highPrices;
        this._openPrices = openPrices;
        this._closePrices = closePrices;
        this._volumes = volumes;
        this._closePrices = closePrices;
    }


    get times() {
        return this._times;
    }

    set times(value) {
        this._times = value;
    }

    get lowPrices() {
        return this._lowPrices;
    }

    set lowPrices(value) {
        this._lowPrices = value;
    }

    get highPrices() {
        return this._highPrices;
    }

    set highPrices(value) {
        this._highPrices = value;
    }

    get openPrices() {
        return this._openPrices;
    }

    set openPrices(value) {
        this._openPrices = value;
    }

    get closePrices() {
        return this._closePrices;
    }

    set closePrices(value) {
        this._closePrices = value;
    }

    get volumes() {
        return this._volumes;
    }

    set volumes(value) {
        this._volumes = value;
    }
}

module.exports = ProductRates;