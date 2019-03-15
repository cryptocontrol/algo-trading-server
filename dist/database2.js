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
const DB = require('node-json-db');
const _ = require("underscore");
const hat = require("hat");
const apiKeysDB = new DB('./storage/apikeys', true, false);
const triggersDB = new DB('./storage/triggers', true, false);
/**
 * Adds the api key for the given user and exchange
 *
 * @param uid the uid of the user
 * @param ex the exchange
 * @param params the api key details
 */
exports.addApiKeys = (uid, ex, params) => __awaiter(this, void 0, void 0, function* () { return apiKeysDB.push(`/${ex}/${uid}`, params, true); });
/**
 * Adds a new trigger into the DB
 *
 * @param uid the uid of the user
 * @param sym the symbol being traded
 * @param ex the exchange
 * @param strategy the strategy (stop-loss, trailing-stop-loss etc...)
 * @param params the params for the strategy
 */
exports.addTrigger = (uid, sym, ex, strategy, params) => __awaiter(this, void 0, void 0, function* () {
    const trigger = {
        strategy,
        params,
        uid,
        addedAt: (new Date()).getTime(),
        active: true
    };
    triggersDB.push(`/${ex}/${sym}/${hat()}`, trigger, false);
    return trigger;
});
/**
 * Get all the active triggers for the given user
 * @param uid the user id
 */
exports.getTriggersForUser = (uid) => __awaiter(this, void 0, void 0, function* () {
    const data = yield triggersDB.getData('/');
    const results = [];
    _.mapObject(data, (symbols, exchange) => {
        _.mapObject(symbols, (triggerIds, symbol) => {
            _.mapObject(triggerIds, (trigger, id) => {
                if (trigger.uid !== uid)
                    return;
                results.push({ id, trigger, symbol, exchange });
            });
        });
    });
    return results;
});
/**
 * Get the API keys for the given user
 * @param uid the user id
 */
exports.getKeysForUser = (uid) => __awaiter(this, void 0, void 0, function* () {
    const data = yield apiKeysDB.getData('/');
    const results = {};
    _.mapObject(data, (val, exchange) => {
        for (let uid2 of _.keys(val)) {
            if (uid2 === uid) {
                results[exchange] = val[uid2];
                return;
            }
        }
    });
    return results;
});
/**
 * Gets a specific trigger
 *
 * @param ex the exchange id
 * @param sym the symbol
 * @param id the id of the trigger
 */
exports.getTrigger = (ex, sym, id) => __awaiter(this, void 0, void 0, function* () { return yield triggersDB.getData(`/${ex}/${sym}/${id}`); });
/**
 * Gets the triggers for the given symbol and exchange
 * @param ex the exchange id
 * @param sym the symbol
 */
exports.getTriggersForSymbol = (ex, sym) => __awaiter(this, void 0, void 0, function* () { return yield triggersDB.getData(`/${ex}/${sym}`); });
/**
 * Get the API keys for the given exchange
 *
 * @param ex the exchange id
 */
exports.getKeysForExchange = (ex) => __awaiter(this, void 0, void 0, function* () { return yield apiKeysDB.getData(`/${ex}`); });
/**
 * Delete the API keys for the given exchange, for the given user
 *
 * @param uid the user id
 * @param ex the exchange id
 */
exports.deleteApiKey = (uid, ex) => __awaiter(this, void 0, void 0, function* () { return yield apiKeysDB.delete(`/${ex}/${uid}`); });
/**
 * Delete the trigger with the given id
 *
 * @param ex the exchange id
 * @param sym the symbol
 * @param id the id of the trigger
 */
exports.deleteTrigger = (ex, sym, id) => __awaiter(this, void 0, void 0, function* () { return yield triggersDB.delete(`/${ex}/${sym}/${id}`); });
