"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTrigger_1 = require("./BaseTrigger");
class StopLossTrigger extends BaseTrigger_1.default {
    constructor(triggerDB) {
        super(triggerDB, 'Stop Loss');
    }
    onTrade(trade) {
        if (!this.isLive)
            return;
        const { price } = trade;
        // if price reaches or goes below the stop loss price, then
        // we close the position with a market order
        if (price <= this.triggerDB.targetPrice) {
            this.advice('close-position', price, this.triggerDB.targetVolume);
            this.close();
        }
    }
    onCandle(_candle) {
        // do nothing
    }
}
exports.default = StopLossTrigger;
