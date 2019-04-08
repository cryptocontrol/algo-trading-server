"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseExchange_1 = require("./BaseExchange");
class CCXTExchange extends BaseExchange_1.default {
    constructor() {
        super(...arguments);
        this.tradeTimeouts = {};
        this.orderbookTimeouts = {};
    }
    /**
     * The CCXT version of streaming orderbook is a polling fn.
     */
    streamOrderbook(symbol) {
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const orderbook = yield this.exchange.fetchOrderBook(symbol);
            const mappedOrderbook = {
                bids: orderbook.bids.map(a => { return { price: a[0], amount: a[1] }; }),
                asks: orderbook.asks.map(a => { return { price: a[0], amount: a[1] }; })
            };
            this.emit(`orderbook:full:${symbol}`, mappedOrderbook);
        }), this.exchange.rateLimit * 3);
        this.tradeTimeouts[symbol] = Number(interval);
    }
    /**
     * The CCXT version of streaming trades is a polling fn.
     */
    streamTrades(symbol) {
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const trades = yield this.exchange.fetchTrades(symbol);
            this.emit(`trade:full:${symbol}`, trades);
        }), this.exchange.rateLimit * 3);
        this.tradeTimeouts[symbol] = Number(interval);
    }
    getTrades(symbol, since, descending) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.fetchTrades(symbol, since);
        });
    }
    getOrderbook(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the orderbook
            const orderbook = yield this.exchange.fetchOrderBook(symbol);
            const mappedOrderbook = {
                bids: orderbook.bids.map(a => { return { price: a[0], amount: a[1] }; }),
                asks: orderbook.asks.map(a => { return { price: a[0], amount: a[1] }; })
            };
            return mappedOrderbook;
        });
    }
    stopStreamingOrderbook(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.tradeTimeouts[symbol])
                return;
            clearInterval(this.tradeTimeouts[symbol]);
            delete this.tradeTimeouts[symbol];
        });
    }
    stopStreamingTrades(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.orderbookTimeouts[symbol])
                return;
            clearInterval(this.orderbookTimeouts[symbol]);
            delete this.orderbookTimeouts[symbol];
        });
    }
    executeOrder(order) {
        return;
    }
    canStreamTrades(symbol) {
        return false;
    }
}
exports.default = CCXTExchange;
