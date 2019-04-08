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
const express_1 = require("express");
const Bluebird = require("bluebird");
const Controllers = require("../controllers/keys");
const router = express_1.Router();
// add an api key for an exchange
router.post('/:exchange', (req, res, next) => {
    Controllers.setAPIKey(req.uid, req.params.exchange, req.body)
        .then(data => res.json(data))
        .catch(next);
});
// add api keys for multiple exchanges
router.post('/', (req, res, next) => {
    Bluebird.mapSeries(req.body, (data) => Controllers.setAPIKey(req.uid, data.exchange, data.keys))
        .then(data => res.json(data))
        .catch(next);
});
// get all user's api keys
router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    Controllers.getAllUserApiKeys(req.uid)
        .then(data => res.json(data))
        .catch(next);
}));
// delete an api for an exchange
router.delete('/:exchange', (req, res, next) => {
    Controllers.deleteApiKey(req.uid, req.params.exchange)
        .then(data => res.json(data))
        .catch(next);
});
exports.default = router;
