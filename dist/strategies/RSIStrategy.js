"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseStrategy_1 = require("./BaseStrategy");
const RSI_1 = require("../indicators/RSI");
const log_1 = require("../utils/log");
class RSIStrategy extends BaseStrategy_1.default {
    constructor(id, trigger) {
        super('RSI');
        this.thresholdHigh = 70;
        this.thresholdLow = 20;
        this.persistence = 0;
        this.trend = {
            direction: 'none',
            duration: 0,
            persisted: false,
            adviced: false
        };
        this.rsi = new RSI_1.default(15);
        // this.requiredHistory = this.tradingAdvisor.historySize
        // // define the indicators we need
        // this.addIndicator('rsi', 'RSI', this.settings)
    }
    static create(id, trigger) {
        return new RSIStrategy(id, trigger);
    }
    // for debugging purposes log the last
    // calculated parameters.
    log(candle) {
        const digits = 8;
        const rsi = this.rsi;
        log_1.default.debug('calculated RSI properties for candle:');
        log_1.default.debug('\t', 'rsi:', rsi.result.toFixed(digits));
        log_1.default.debug('\t', 'price:', candle.close.toFixed(digits));
    }
    process(lastprice) {
    }
    check() {
        const rsi = this.rsi;
        const rsiVal = rsi.result;
        if (rsiVal > this.thresholdHigh) {
            // new trend detected
            if (this.trend.direction !== 'high')
                this.trend = {
                    duration: 0,
                    persisted: false,
                    direction: 'high',
                    adviced: false
                };
            this.trend.duration++;
            log_1.default.debug(`in high since ${this.trend.duration} candle(s)`);
            if (this.trend.duration >= this.persistence)
                this.trend.persisted = true;
            if (this.trend.persisted && !this.trend.adviced) {
                this.trend.adviced = true;
                this.advice('short');
            }
            else
                this.advice('do-nothing');
        }
        else if (rsiVal < this.thresholdLow) {
            // new trend detected
            if (this.trend.direction !== 'low')
                this.trend = {
                    duration: 0,
                    persisted: false,
                    direction: 'low',
                    adviced: false
                };
            this.trend.duration++;
            log_1.default.debug(`in low since ${this.trend.duration} candle(s)`);
            if (this.trend.duration >= this.persistence)
                this.trend.persisted = true;
            if (this.trend.persisted && !this.trend.adviced) {
                this.trend.adviced = true;
                this.advice('long');
            }
            else
                this.advice('do-nothing');
        }
        else {
            log_1.default.debug('in no trend');
            this.advice('do-nothing');
        }
    }
}
exports.default = RSIStrategy;
