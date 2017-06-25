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

module.exports = Account;