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
const Controllers = require("../controllers/plugins");
const router = express_1.Router();
// get all plugins
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield Controllers.getPlugins(req.uid)); }));
// register a plugin
router.post('/:kind', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uid = req.uid;
    const kind = req.params.kind;
    const params = req.body;
    const plugin = yield Controllers.regsiterPlugin(uid, kind, params);
    res.json({ plugin, success: true });
}));
router.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uid = req.uid;
    const id = Number(req.params.id);
    yield Controllers.deleteplugin(uid, id);
    res.json({ success: true });
}));
router.put('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uid = req.uid;
    const id = req.params.id;
    yield Controllers.updatePlugin(uid, id, req.body);
    res.json({ success: true });
}));
exports.default = router;
