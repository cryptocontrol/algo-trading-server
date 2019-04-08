"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTrigger_1 = require("./BaseTrigger");
class TrailingStopTrigger extends BaseTrigger_1.default {
    /**
     * Note: as of now only supports trailing the price going up (after
     * a buy), on trigger (when the price moves down) you should sell.
     *
     * @param trail        fixed offset from the price
     * @param initialPrice initial price, preferably buy price
     */
    constructor(trigger) {
        super(trigger, 'Trailing Stop');
        const params = JSON.parse(trigger.params);
        this.trail = params.trail;
        this.previousPrice = params.initialPrice;
        this.trailingPoint = params.initialPrice - this.trail;
    }
    onTrade(trade) {
        const { price } = trade;
        if (!this.isLive)
            return;
        if (price > this.trailingPoint + this.trail)
            this.trailingPoint = price - this.trail;
        this.previousPrice = price;
        if (price <= this.trailingPoint) {
            this.advice('close-position', price, this.triggerDB.targetVolume);
            this.close();
        }
    }
    onCandle(_candle) {
        // do nothing
    }
}
exports.default = TrailingStopTrigger;
