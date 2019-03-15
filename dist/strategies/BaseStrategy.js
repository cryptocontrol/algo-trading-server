"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hat = require("hat");
class BaseStrategy {
    constructor(name) {
        this.uid = hat();
        this.name = name;
    }
    advice(reason) {
        // do nothing
    }
}
exports.default = BaseStrategy;
