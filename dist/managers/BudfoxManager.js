"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const budfox_1 = require("src/budfox");
const ExchangeManager_1 = require("./ExchangeManager");
const log_1 = require("src/utils/log");
class BudfoxManger {
    constructor() {
        this.budfoxes = {};
        this.manager = ExchangeManager_1.default.getInstance();
    }
    getBudfox(exchangeId, symbol) {
        const exchangeSymbol = `${exchangeId}-${symbol}`;
        if (this.budfoxes[exchangeSymbol])
            return this.budfoxes[exchangeSymbol];
        const exchange = this.manager.getExchange(exchangeId);
        log_1.default.debug('creating budfox for', exchange.id, symbol);
        const budfox = new budfox_1.default(exchange, symbol);
        this.budfoxes[exchangeSymbol] = budfox;
        return budfox;
    }
    removeBudfox(budfox) {
        log_1.default.debug('removing budfox for', budfox.exchange.id, budfox.symbol);
        const exchangeSymbol = `${budfox.exchange.id}-${budfox.symbol}`;
        if (this.budfoxes[exchangeSymbol])
            delete this.budfoxes[exchangeSymbol];
        budfox.murder();
    }
    static getInstance() {
        return BudfoxManger.instance;
    }
}
BudfoxManger.instance = new BudfoxManger();
exports.default = BudfoxManger;
