"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const triggers_1 = require("src/database/models/triggers");
const TriggerManager_1 = require("src/managers/TriggerManager");
/**
 * create a new trigger for a user
 */
exports.createTrigger = (uid, exchange, symbol, kind, params) => __awaiter(this, void 0, void 0, function* () {
    const { price, volume, orderId } = params, rest = __rest(params, ["price", "volume", "orderId"]);
    const trigger = new triggers_1.default({
        uid,
        symbol,
        exchange,
        kind,
        orderId,
        targetVolume: volume,
        targetPrice: price,
        params: JSON.stringify(rest)
    });
    yield trigger.save();
    // once the trigger is created, we start tracking it in our DB
    TriggerManager_1.default.getInstance().addTrigger(trigger);
    return trigger;
});
/**
 * get all existing triggers for a user
 */
exports.getTriggers = (uid) => __awaiter(this, void 0, void 0, function* () {
    const triggers = yield triggers_1.default.findAll({ where: { uid, isActive: true } });
    return triggers;
});
/**
 * Delete a specific trigger
 */
exports.deleteTrigger = (uid, id) => __awaiter(this, void 0, void 0, function* () {
    const trigger = yield triggers_1.default.findOne({ where: { uid, id } });
    if (trigger) {
        TriggerManager_1.default.getInstance().removeTrigger(trigger);
        trigger.isActive = false;
        trigger.save();
    }
});
