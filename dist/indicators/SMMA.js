"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// required indicators
const SMA_1 = require("./SMA");
const Indicator_1 = require("./Indicator");
class SMMA extends Indicator_1.default {
    constructor(weight) {
        super('price');
        this.prices = [];
        this.sma = new SMA_1.default(weight);
        this.weight = weight;
    }
    update(price) {
        this.prices[this.age] = price;
        if (this.prices.length < this.weight)
            this.sma.update(price);
        else if (this.prices.length === this.weight) {
            this.sma.update(price);
            this.result = this.sma.result;
        }
        else
            this.result = (this.result * (this.weight - 1) + price) / this.weight;
        this.age++;
    }
}
exports.default = SMMA;
