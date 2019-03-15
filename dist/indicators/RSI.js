"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// required indicators
const SMMA_1 = require("./SMMA");
const Indicator_1 = require("./Indicator");
class RSI extends Indicator_1.default {
    constructor(interval) {
        super('candle');
        this.d = 0;
        this.lastClose = null;
        this.rs = 0;
        this.u = 0;
        this.weight = interval;
        this.avgU = new SMMA_1.default(this.weight);
        this.avgD = new SMMA_1.default(this.weight);
    }
    update(candle) {
        const currentClose = candle.close;
        if (this.lastClose === null) {
            // Set initial price to prevent invalid change calculation
            this.lastClose = currentClose;
            // Do not calculate RSI for this reason - there's no change!
            this.age++;
            return;
        }
        if (currentClose > this.lastClose) {
            this.u = currentClose - this.lastClose;
            this.d = 0;
        }
        else {
            this.u = 0;
            this.d = this.lastClose - currentClose;
        }
        this.avgU.update(this.u);
        this.avgD.update(this.d);
        this.rs = this.avgU.result / this.avgD.result;
        this.result = 100 - (100 / (1 + this.rs));
        if (this.avgD.result === 0 && this.avgU.result !== 0)
            this.result = 100;
        else if (this.avgD.result === 0)
            this.result = 0;
        this.lastClose = currentClose;
        this.age++;
    }
}
exports.default = RSI;
