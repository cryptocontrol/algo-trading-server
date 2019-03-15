"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ccxt = require("ccxt");
const binance_api_node_1 = require("binance-api-node");
const BaseExchange_1 = require("./core/BaseExchange");
class Binance extends BaseExchange_1.default {
    constructor() {
        const binance = new ccxt.binance();
        super(binance);
    }
    startListening() {
        const client = binance_api_node_1.default();
        client.ws.trades(['BTCUSDT'], trade => this.onPriceUpdate('BTCUSDT', Number(trade.price)));
    }
}
exports.default = Binance;
