class ProductRates {
    constructor(times, lowPrices, highPrices, openPrices, closePrices, volumes) {
        this._times = times;
        this._lowPrices = lowPrices;
        this._highPrices = highPrices;
        this._openPrices = openPrices;
        this._closePrices = closePrices;
        this._volumes = volumes;
        this._closePrices = closePrices;
        this._lastTime = times[times.length - 1];
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

    get lastTime() {
        return this._lastTime;
    }

    set lastTime(value) {
        this._lastTime = value;
    }

    get lastLowPrice() {
        return this._lowPrices[this._lowPrices.length - 1];
    }

    get lastHighPrice() {
        return this._highPrices[this._highPrices.length - 1];
    }

    get lastOpenPrice() {
        return this._openPrices[this._openPrices.length - 1];
    }

    get lastClosePrice() {
        return this._closePrices[this._closePrices.length - 1];
    }
}

module.exports = ProductRates;