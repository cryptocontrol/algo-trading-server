"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is where the HTTP Json server runs. It is what is used by the CryptoControl terminal to
 * communicate with the trading sever.
 */
const express_1 = require("express");
const jwt = require("jsonwebtoken");
const InvalidJWTError_1 = require("src/errors/InvalidJWTError");
const NotAuthorizedError_1 = require("src/errors/NotAuthorizedError");
const controllers_1 = require("./controllers");
const packageJson = require('../../package.json');
const router = express_1.Router();
/**
 * Redirect to the github page
 */
router.get('/', (_req, res) => res.redirect('https://github.com/cryptocontrol/algo-trading-server'));
/**
 * Gets the status of the server. A great way for the terminal to check if the
 * trading server is of the latest version or not.
 */
router.get('/status', (_req, res) => {
    res.json({
        version: packageJson.version,
        uptime: process.uptime()
    });
});
// authenticate the user using JWT tokens
router.use((req, _res, next) => {
    const token = req.header('x-jwt');
    const jwtSecret = router.get('secret') || process.env.SERVER_SECRET || 'secret_keyboard_cat';
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
router.get('/me', (req, res) => res.json({ uid: req.uid }));
/**
 * Set the API key for an exchange for the logged in user
 */
router.post('/:exchange/key', controllers_1.setAPIKey);
exports.default = router;
