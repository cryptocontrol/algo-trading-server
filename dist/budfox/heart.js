"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const events_1 = require("events");
const utils_1 = require("src/utils");
const log_1 = require("src/utils/log");
/**
 * The heart schedules and emit ticks every 20 seconds.
 */
class Heart extends events_1.EventEmitter {
    constructor(tickrate = 20) {
        super();
        this.lastTick = 0;
        this.tick = () => {
            if (this.lastTick) {
                // make sure the last tick happened not too long ago
                // @link https://github.com/askmike/gekko/issues/514
                if (this.lastTick < Date.now() - this.tickrate * 3000)
                    utils_1.die('Failed to tick in time, see https://github.com/askmike/gekko/issues/514 for details', true);
            }
            this.lastTick = Date.now();
            this.emit('tick');
        };
        this.tickrate = tickrate;
    }
    pump() {
        log_1.default.debug('scheduling ticks');
        this.scheduleTicks();
    }
    attack() {
        log_1.default.debug('stopping ticks');
        clearInterval(this.interval);
    }
    scheduleTicks() {
        this.interval = setInterval(this.tick, this.tickrate * 1000);
        _.defer(this.tick);
    }
}
exports.default = Heart;
