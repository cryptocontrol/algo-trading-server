"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
// Note: as of now only supports trailing the price going up (after
// a buy), on trigger (when the price moves down) you should sell.
// @param initialPrice: initial price, preferably buy price
// @param trail: fixed offset from the price
// @param onTrigger: fn to call when the stop triggers
class Trigger extends EventEmitter {
    // constructor({ trail, initialPrice, onTrigger }) {
    constructor() {
        super();
        this.isLive = true;
        // this.trail = trail
        // this.onTrigger = onTrigger
        // this.previousPrice = initialPrice
        // this.trailingPoint = initialPrice - this.trail
    }
    trigger(price) {
        if (!this.isLive)
            return;
        this.emit('trigger', price);
    }
}
exports.default = Trigger;
