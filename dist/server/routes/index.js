"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotAuthorizedError_1 = require("../../errors/NotAuthorizedError");
const advices_1 = require("./advices");
const keys_1 = require("./keys");
const plugins_1 = require("./plugins");
const triggers_1 = require("./triggers");
const packageJson = require('../../../package.json');
const router = express_1.Router();
/**
 * Gets the status of the server. A great way for the terminal to check if the
 * trading server is of the latest version or not.
 */
router.get('/', (_req, res) => {
    res.json({
        sourceCode: 'https://github.com/cryptocontrol/algo-trading-server',
        version: packageJson.version,
        uptime: process.uptime()
    });
});
// For every route henceforth; require the user to be logged in
router.use((req, _res, next) => {
    if (!req.uid)
        return next(new NotAuthorizedError_1.default);
    next();
});
// Gets the current user's id
router.get('/me', (req, res) => res.json({ uid: req.uid }));
// init all the different routes
router.use('/advices', advices_1.default);
router.use('/keys', keys_1.default);
router.use('/plugins', plugins_1.default);
router.use('/triggers', triggers_1.default);
/**
 * Error handler
 */
router.use((err, _req, res, _next) => {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});
exports.default = router;
