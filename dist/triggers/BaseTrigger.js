"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const log_1 = require("src/utils/log");
// Note: as of now only supports trailing the price going up (after
// a buy), on trigger (when the price moves down) you should sell.
// @param initialPrice: initial price, preferably buy price
// @param trail: fixed offset from the price
// @param onTrigger: fn to call when the stop triggers
class BaseTrigger extends EventEmitter {
    constructor(triggerDB, name = 'Unkown') {
        super();
        this.name = name;
        this.triggerDB = triggerDB;
    }
    getExchange() {
        return this.triggerDB.exchange;
    }
    getSymbol() {
        return this.triggerDB.symbol;
    }
    getUID() {
        return this.triggerDB.uid;
    }
    getDBId() {
        return this.triggerDB.id;
    }
    isLive() {
        return this.triggerDB.isActive;
    }
    advice(advice, price, amount) {
        if (!this.isLive())
            return;
        // do nothing
        const trigger = this.triggerDB;
        log_1.default.info(`${trigger.kind} trigger for user ${trigger.uid} on ${trigger.exchange} ${trigger.symbol} ` +
            `adviced to ${advice} at ${price} for a volume of ${amount}`);
        // mark the trigger as triggered
        trigger.hasTriggered = true;
        trigger.lastTriggeredAt = new Date;
        trigger.save();
        this.emit('triggered', { advice, price, amount });
    }
    close() {
        this.emit('close');
        // mark the trigger as closed in the DB
        this.triggerDB.isActive = false;
        this.triggerDB.closedAt = new Date;
        this.triggerDB.save();
    }
}
exports.default = BaseTrigger;
