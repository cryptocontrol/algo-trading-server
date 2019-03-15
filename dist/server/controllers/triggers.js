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
const Database = require("../../database2");
const router = express_1.Router();
/**
 * create a new trigger for a user
 */
router.post('/triggers/:exchange/:symbol/:strategy', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
router.get('/triggers', (req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield Database.getTriggersForUser(req.uid)); }));
/**
 * Delete a specific trigger
 */
router.delete('/triggers/:exchange/:symbol/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
