"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class BaseExchange extends events_1.EventEmitter {
    constructor(exchange) {
        super();
        this.exchange = exchange;
        this.id = exchange.id;
    }
    // public abstract loadMarkets (): void
    // public abstract fetchMarkets (): void
    // public abstract fetchTickers (symbol: string): void
    toString() {
        return this.exchange.id;
    }
    supportedOrderTypes() { return []; }
}
exports.default = BaseExchange;
