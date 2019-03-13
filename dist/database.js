"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var DB = require('node-json-db');
var _ = require("underscore");
var hat = require("hat");
var apiKeysDB = new DB('./storage/apikeys', true, false);
var triggersDB = new DB('./storage/triggers', true, false);
/**
 * Adds the api key for the given user and exchange
 *
 * @param uid the uid of the user
 * @param ex the exchange
 * @param params the api key details
 */
exports.addApiKeys = function (uid, ex, params) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, apiKeysDB.push("/" + ex + "/" + uid, params, true)
        /**
         * Adds a new trigger into the DB
         *
         * @param uid the uid of the user
         * @param sym the symbol being traded
         * @param ex the exchange
         * @param strategy the strategy (stop-loss, trailing-stop-loss etc...)
         * @param params the params for the strategy
         */
    ];
}); }); };
/**
 * Adds a new trigger into the DB
 *
 * @param uid the uid of the user
 * @param sym the symbol being traded
 * @param ex the exchange
 * @param strategy the strategy (stop-loss, trailing-stop-loss etc...)
 * @param params the params for the strategy
 */
exports.addTrigger = function (uid, sym, ex, strategy, params) { return __awaiter(_this, void 0, void 0, function () {
    var trigger;
    return __generator(this, function (_a) {
        trigger = {
            strategy: strategy,
            params: params,
            uid: uid,
            addedAt: (new Date()).getTime(),
            active: true
        };
        triggersDB.push("/" + ex + "/" + sym + "/" + hat(), trigger, false);
        return [2 /*return*/, trigger];
    });
}); };
/**
 * Get all the active triggers for the given user
 * @param uid the user id
 */
exports.getTriggersForUser = function (uid) { return __awaiter(_this, void 0, void 0, function () {
    var data, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, triggersDB.getData('/')];
            case 1:
                data = _a.sent();
                results = [];
                _.mapObject(data, function (symbols, exchange) {
                    _.mapObject(symbols, function (triggerIds, symbol) {
                        _.mapObject(triggerIds, function (trigger, id) {
                            if (trigger.uid !== uid)
                                return;
                            results.push({ id: id, trigger: trigger, symbol: symbol, exchange: exchange });
                        });
                    });
                });
                return [2 /*return*/, results];
        }
    });
}); };
/**
 * Get the API keys for the given user
 * @param uid the user id
 */
exports.getKeysForUser = function (uid) { return __awaiter(_this, void 0, void 0, function () {
    var data, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, apiKeysDB.getData('/')];
            case 1:
                data = _a.sent();
                results = {};
                _.mapObject(data, function (val, exchange) {
                    for (var _i = 0, _a = _.keys(val); _i < _a.length; _i++) {
                        var uid2 = _a[_i];
                        if (uid2 === uid) {
                            results[exchange] = val[uid2];
                            return;
                        }
                    }
                });
                return [2 /*return*/, results];
        }
    });
}); };
/**
 * Gets a specific trigger
 *
 * @param ex the exchange id
 * @param sym the symbol
 * @param id the id of the trigger
 */
exports.getTrigger = function (ex, sym, id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, triggersDB.getData("/" + ex + "/" + sym + "/" + id)
            /**
             * Gets the triggers for the given symbol and exchange
             * @param ex the exchange id
             * @param sym the symbol
             */
        ];
        case 1: return [2 /*return*/, _a.sent()
            /**
             * Gets the triggers for the given symbol and exchange
             * @param ex the exchange id
             * @param sym the symbol
             */
        ];
    }
}); }); };
/**
 * Gets the triggers for the given symbol and exchange
 * @param ex the exchange id
 * @param sym the symbol
 */
exports.getTriggersForSymbol = function (ex, sym) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, triggersDB.getData("/" + ex + "/" + sym)
            /**
             * Get the API keys for the given exchange
             *
             * @param ex the exchange id
             */
        ];
        case 1: return [2 /*return*/, _a.sent()
            /**
             * Get the API keys for the given exchange
             *
             * @param ex the exchange id
             */
        ];
    }
}); }); };
/**
 * Get the API keys for the given exchange
 *
 * @param ex the exchange id
 */
exports.getKeysForExchange = function (ex) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, apiKeysDB.getData("/" + ex)
            /**
             * Delete the API keys for the given exchange, for the given user
             *
             * @param uid the user id
             * @param ex the exchange id
             */
        ];
        case 1: return [2 /*return*/, _a.sent()
            /**
             * Delete the API keys for the given exchange, for the given user
             *
             * @param uid the user id
             * @param ex the exchange id
             */
        ];
    }
}); }); };
/**
 * Delete the API keys for the given exchange, for the given user
 *
 * @param uid the user id
 * @param ex the exchange id
 */
exports.deleteApiKey = function (uid, ex) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, apiKeysDB.delete("/" + ex + "/" + uid)
            /**
             * Delete the trigger with the given id
             *
             * @param ex the exchange id
             * @param sym the symbol
             * @param id the id of the trigger
             */
        ];
        case 1: return [2 /*return*/, _a.sent()
            /**
             * Delete the trigger with the given id
             *
             * @param ex the exchange id
             * @param sym the symbol
             * @param id the id of the trigger
             */
        ];
    }
}); }); };
/**
 * Delete the trigger with the given id
 *
 * @param ex the exchange id
 * @param sym the symbol
 * @param id the id of the trigger
 */
exports.deleteTrigger = function (ex, sym, id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, triggersDB.delete("/" + ex + "/" + sym + "/" + id)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
