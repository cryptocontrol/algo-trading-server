"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Trigger_1 = require("./Trigger");
class TrailingStop extends Trigger_1.default {
    /**
     * Note: as of now only supports trailing the price going up (after
     * a buy), on trigger (when the price moves down) you should sell.
     *
     * @param trail        fixed offset from the price
     * @param initialPrice initial price, preferably buy price
     */
    constructor(trail, initialPrice) {
        super();
        this.trail = trail;
        this.previousPrice = initialPrice;
        this.trailingPoint = initialPrice - this.trail;
    }
    updatePrice(price) {
        if (!this.isLive)
            return;
        if (price > this.trailingPoint + this.trail)
            this.trailingPoint = price - this.trail;
        this.previousPrice = price;
        if (price <= this.trailingPoint) {
            this.isLive = false;
            this.trigger(this.previousPrice);
        }
    }
    updateTrail(trail) {
        if (!this.isLive)
            return;
        this.trail = trail;
        this.trailingPoint = this.previousPrice - this.trail;
        // recheck whether moving the trail triggered.
        this.updatePrice(this.previousPrice);
    }
}
exports.default = TrailingStop;
