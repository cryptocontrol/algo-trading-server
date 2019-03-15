"use strict";
// required indicators
// Simple Moving Average - O(1) implementation
Object.defineProperty(exports, "__esModule", { value: true });
const Indicator_1 = require("./Indicator");
class SMA extends Indicator_1.default {
    constructor(windowLength) {
        super('price');
        this.prices = [];
        this.sum = 0;
        this.windowLength = windowLength;
    }
    update(price) {
        var tail = this.prices[this.age] || 0; // oldest price in window
        this.prices[this.age] = price;
        this.sum += price - tail;
        this.result = this.sum / this.prices.length;
        this.age = (this.age + 1) % this.windowLength;
    }
}
exports.default = SMA;
