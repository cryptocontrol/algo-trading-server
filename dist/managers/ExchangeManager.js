"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ccxt = require("ccxt");
const CCXTExchange_1 = require("src/exchanges/core/CCXTExchange");
const BinanceExchange_1 = require("src/exchanges/BinanceExchange");
class ExchangeManger {
    constructor() {
        this.exchanges = {};
    }
    getExchange(exchangeId) {
        if (this.exchanges[exchangeId])
            return this.exchanges[exchangeId];
        // create a CCXT instance for each exchange; (note that the enableRateLimit should be enabled)
        const ccxtExchange = new ccxt[exchangeId]({ enableRateLimit: true });
        const exchange = this.createBaseExchangeInstance(ccxtExchange);
        this.exchanges[exchangeId] = exchange;
        return exchange;
    }
    createBaseExchangeInstance(exchange) {
        if (exchange.id === 'binance')
            return new BinanceExchange_1.default(exchange);
        return new CCXTExchange_1.default(exchange);
    }
    static getInstance() {
        return ExchangeManger.instance;
    }
}
ExchangeManger.instance = new ExchangeManger();
exports.default = ExchangeManger;
