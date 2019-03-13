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
var bodyParser = require("body-parser");
var express = require("express");
var _ = require("underscore");
var jwt = require("jsonwebtoken");
var Database = require("./database");
var InvalidJWTError_1 = require("./errors/InvalidJWTError");
var NotAuthorizedError_1 = require("./errors/NotAuthorizedError");
var packageJson = require('../package.json');
var jwtSecret = process.env.SERVER_SECRET || 'secret_keyboard_cat';
var app = express();
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));
/**
 * Redirect to the github page
 */
app.get('/', function (_req, res) { return res.redirect('https://github.com/cryptocontrol/adv-trading-server'); });
// authenticate the user
app.use(function (req, _res, next) {
    var token = req.header('x-jwt');
    // verify the jwt token
    jwt.verify(token, jwtSecret, function (err, decoded) {
        if (err)
            return next(new InvalidJWTError_1.default);
        if (!decoded.uid)
            return next(new NotAuthorizedError_1.default);
        req.uid = decoded.uid;
        next();
    });
});
/**
 * Gets the status of the server. A great way for the terminal to check if the
 * trading server is of the latest version or not.
 */
app.get('/status', function (req, res) {
    res.json({
        version: packageJson.version,
        uptime: process.uptime()
    });
});
/**
 * Set the API key for an exchange for the logged in user
 */
app.post('/:exchange/key', function (req, res) {
    Database.addApiKeys(req.uid, req.params.exchange, req.body);
    res.json({ success: true });
});
/**
 * Set the API keys for multiple exchanges for the given user
 */
app.post('/keys', function (req, res) {
    var data = req.body || [];
    data.forEach(function (data) { return Database.addApiKeys(req.uid, data.exchange, data.keys); });
    res.json({ success: true });
});
/**
 * Get all the API keys saved for the logged in user
 */
app.get('/keys', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var exchanges, parsedKeys;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Database.getKeysForUser(req.uid)
                // hide the secret keys
            ];
            case 1:
                exchanges = _a.sent();
                parsedKeys = _.mapObject(exchanges, function (params) {
                    return _.mapObject(params, function (val, key) {
                        if (key === 'key')
                            return val;
                        return val.replace(/./gi, '*');
                    });
                });
                res.json(parsedKeys);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Delete the API keys for the given exchange for the currently logged in user
 */
app.delete('/:exchange/key', function (req, res) {
    Database.deleteApiKey(req.uid, req.params.exchange);
    res.json({ success: true });
});
/**
 * create a new trigger for a user
 */
app.post('/triggers/:exchange/:symbol/:strategy', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var uid, symbol, exchange, strategy, params, trigger;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uid = req.uid;
                symbol = req.params.symbol;
                exchange = req.params.exchange;
                strategy = req.params.strategy;
                params = req.body;
                return [4 /*yield*/, Database.addTrigger(uid, symbol, exchange, strategy, params)];
            case 1:
                trigger = _a.sent();
                res.json({ trigger: trigger, success: true });
                return [2 /*return*/];
        }
    });
}); });
/**
 * get all existing triggers for a user
 */
app.get('/triggers', function (req, res) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = res).json;
            return [4 /*yield*/, Database.getTriggersForUser(req.uid)];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); });
/**
 * Delete a specific trigger
 */
app.delete('/triggers/:exchange/:symbol/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var uid, symbol, exchange, id, trigger;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uid = req.uid;
                symbol = req.params.symbol;
                exchange = req.params.exchange;
                id = req.params.id;
                return [4 /*yield*/, Database.getTrigger(exchange, symbol, id)];
            case 1:
                trigger = _a.sent();
                if (!trigger)
                    throw new Error('no such trigger');
                if (trigger.uid !== uid)
                    throw new Error('not your trigger');
                return [4 /*yield*/, Database.deleteTrigger(exchange, symbol, id)];
            case 2:
                _a.sent();
                res.json({ success: true });
                return [2 /*return*/];
        }
    });
}); });
/**
 * Error handler
 */
app.use(function (err, _req, res, _next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});
exports.default = app;
