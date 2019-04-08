"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTrigger_1 = require("./BaseTrigger");
class TakeProfitTrigger extends BaseTrigger_1.default {
    constructor(triggerDB) {
        super(triggerDB, 'Take Profit');
    }
    onTrade(trade) {
        if (!this.isLive)
            return;
        const { price } = trade;
        // if price reaches or goes above the take profit price, then
        // we close the position
        if (price >= this.triggerDB.targetPrice) {
            const targetPrice = Math.max(this.triggerDB.targetPrice, price);
            this.advice('close-position', targetPrice, this.triggerDB.targetVolume);
            this.close();
        }
    }
    onCandle(_candle) {
        // do nothing
    }
}
exports.default = TakeProfitTrigger;
