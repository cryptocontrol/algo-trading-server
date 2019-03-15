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
const bodyParser = require("body-parser");
const express = require("express");
const _ = require("underscore");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Database = require("../database2");
const InvalidJWTError_1 = require("src/errors/InvalidJWTError");
const NotAuthorizedError_1 = require("src/errors/NotAuthorizedError");
const userexchanges_1 = require("src/database/models/userexchanges");
const routes_1 = require("./routes");
const app = express();
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));
// enable all cors
app.use(cors());
app.use(routes_1.default);
// authenticate the user using JWT tokens
app.use((req, _res, next) => {
    const token = req.header('x-jwt');
    const jwtSecret = app.get('secret') || process.env.SERVER_SECRET || 'secret_keyboard_cat';
    // verify the jwt token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err)
            return next(new InvalidJWTError_1.default);
        if (!decoded.uid)
            return next(new NotAuthorizedError_1.default);
        req.uid = decoded.uid;
        next();
    });
});
/**
 * Gets the current user's id
 */
app.get('/me', (req, res) => res.json({ uid: req.uid }));
/**
 * Set the API key for an exchange for the logged in user
 */
app.post('/:exchange/key', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const found = yield userexchanges_1.default.findOne({
            where: {
                uid: req.uid,
                exchange: req.params.exchange
            }
        });
        if (found) {
            found.apiKey = req.body.key;
            found.apiSecret = req.body.secret;
            found.apiPassword = req.body.pasword;
            yield found.save();
            return res.json(found);
        }
        const row = new userexchanges_1.default({
            uid: req.uid,
            exchange: req.params.exchange,
            apiKey: req.body.key,
            apiSecret: req.body.secret,
            apiPassword: req.body.password
        });
        yield row.save();
        res.json(row);
    }
    catch (e) {
        next(e);
    }
}));
/**
 * Set the API keys for multiple exchanges for the given user
 */
app.post('/keys', (req, res) => {
    const data = req.body || [];
    data.forEach(data => Database.addApiKeys(req.uid, data.exchange, data.keys));
    res.json({ success: true });
});
/**
 * Get all the API keys saved for the logged in user
 */
app.get('/keys', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const exchanges = yield Database.getKeysForUser(req.uid);
    // hide the secret keys
    const parsedKeys = _.mapObject(exchanges, params => {
        return _.mapObject(params, (val, key) => {
            if (key === 'key')
                return val;
            return val.replace(/./gi, '*');
        });
    });
    res.json(parsedKeys);
}));
/**
 * Delete the API keys for the given exchange for the currently logged in user
 */
app.delete('/:exchange/key', (req, res) => {
    Database.deleteApiKey(req.uid, req.params.exchange);
    res.json({ success: true });
});
/**
 * create a new trigger for a user
 */
app.post('/triggers/:exchange/:symbol/:strategy', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uid = req.uid;
    const symbol = req.params.symbol;
    const exchange = req.params.exchange;
    const strategy = req.params.strategy;
    const params = req.body;
    const trigger = yield Database.addTrigger(uid, symbol, exchange, strategy, params);
    res.json({ trigger, success: true });
}));
/**
 * get all existing triggers for a user
 */
app.get('/triggers', (req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield Database.getTriggersForUser(req.uid)); }));
/**
 * Delete a specific trigger
 */
app.delete('/triggers/:exchange/:symbol/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uid = req.uid;
    const symbol = req.params.symbol;
    const exchange = req.params.exchange;
    const id = req.params.id;
    const trigger = yield Database.getTrigger(exchange, symbol, id);
    if (!trigger)
        throw new Error('no such trigger');
    if (trigger.uid !== uid)
        throw new Error('not your trigger');
    yield Database.deleteTrigger(exchange, symbol, id);
    res.json({ success: true });
}));
/**
 * Error handler
 */
app.use((err, _req, res, _next) => {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});
exports.default = app;
