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
const _ = require("underscore");
const userexchanges_1 = require("src/database/models/userexchanges");
/**
 * Set the API key for an exchange for the logged in user
 */
exports.setAPIKey = (uid, exchange, data) => __awaiter(this, void 0, void 0, function* () {
    // find or update logic
    const found = yield userexchanges_1.default.findOne({ where: { uid, exchange } });
    if (found) {
        found.apiKey = data.key;
        found.apiSecret = data.secret;
        found.apiPassword = data.password;
        yield found.save();
        return found;
    }
    const row = new userexchanges_1.default({
        uid,
        exchange,
        apiKey: data.key,
        apiSecret: data.secret,
        apiPassword: data.password
    });
    yield row.save();
    return row;
});
/**
 * Get all the API keys saved for the logged in user
 */
exports.getAllUserApiKeys = (uid) => __awaiter(this, void 0, void 0, function* () {
    return yield userexchanges_1.default.findAll({ where: { uid } })
        .then(data => {
        // hide the secret keys
        const parsedKeys = data.map(row => {
            const json = row.toJSON();
            return _.mapObject(json, (val, key) => {
                if (key !== 'apiSecret' && key !== 'apiPassword' || !val)
                    return val;
                return val.replace(/./gi, '*');
            });
        });
        return parsedKeys;
    });
});
exports.deleteApiKey = (uid, exchange) => __awaiter(this, void 0, void 0, function* () {
    return yield userexchanges_1.default.destroy({ where: { uid, exchange } });
});
