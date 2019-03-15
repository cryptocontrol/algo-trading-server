"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const _ = require("underscore");
const Controller = require("../../database2");
const StopLossStrategy_1 = require("../../strategies/StopLossStrategy");
const logger = debug('app:exchange');
class BaseExchange {
    constructor(exchange) {
        this.strategies = [];
        this.exchange = exchange;
    }
    lazyLoadStrategies(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const triggerIdsMap = yield Controller.getTriggersForSymbol(this.exchange.id, symbol);
                this.strategies = [];
                _.mapObject(triggerIdsMap, (trigger, id) => {
                    if (trigger.strategy === 'stop-loss')
                        this.strategies.push(StopLossStrategy_1.default.create(id, trigger));
                });
                return this.strategies;
            }
            catch (e) {
                return [];
            }
        });
    }
    onPriceUpdate(symbol, last) {
        return __awaiter(this, void 0, void 0, function* () {
            logger('processing triggers for', symbol, 'at', last);
            const strategies = yield this.lazyLoadStrategies(symbol);
            strategies.forEach(strategy => strategy.process(last));
        });
    }
    start() {
        //Controller.readDetails()
        // 1. load triggers from the DB
        // 2. start listening for price changes
        this.startListening();
        //this.onPriceUpdate()
    }
}
exports.default = BaseExchange;
