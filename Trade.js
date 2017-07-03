class Trade {
    constructor(productId, orderId, side, size, startingPrice) {
        this._productId = productId;
        this._orderId = orderId;
        this._side = side;
        this._size = size;
        this._startingPrice = startingPrice;
        this._trailingLoss = null;
    }

    get productId() {
        return this._productId;
    }

    set productId(value) {
        this._productId = value;
    }

    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get side() {
        return this._side;
    }

    set side(value) {
        this._side = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get startingPrice() {
        return this._startingPrice;
    }

    set startingPrice(value) {
        this._startingPrice = value;
    }

    get trailingLoss() {
        return this._trailingLoss;
    }

    set trailingLoss(value) {
        this._trailingLoss = value;
    }
}

module.exports = Trade;