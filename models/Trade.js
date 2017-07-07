class Trade {
    constructor(productId, side, size, startingPrice, openingOrderId) {
        this._productId = productId;
        this._side = side;
        this._size = size;
        this._startingPrice = startingPrice;
        this._openingOrderId = openingOrderId;
        this._openingOrderStatus = null;
        this._closingOrderId = null;
        this._closingOrderStatus = null;
        this._trailingLoss = null;
    }

    get productId() {
        return this._productId;
    }

    set productId(value) {
        this._productId = value;
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

    get openingOrderId() {
        return this._openingOrderId;
    }

    set openingOrderId(value) {
        this._openingOrderId = value;
    }

    get closingOrderId() {
        return this._closingOrderId;
    }

    set closingOrderId(value) {
        this._closingOrderId = value;
    }

    get openingOrderStatus() {
        return this._openingOrderStatus;
    }

    set openingOrderStatus(value) {
        this._openingOrderStatus = value;
    }

    get closingOrderStatus() {
        return this._closingOrderStatus;
    }

    set closingOrderStatus(value) {
        this._closingOrderStatus = value;
    }

    get trailingLoss() {
        return this._trailingLoss;
    }

    set trailingLoss(value) {
        this._trailingLoss = value;
    }
}

module.exports = Trade;