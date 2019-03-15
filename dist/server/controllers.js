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
const userexchanges_1 = require("src/database/models/userexchanges");
/**
 * Set the API key for an exchange for the logged in user
 */
exports.setAPIKey = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        // find or update logic
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
});
