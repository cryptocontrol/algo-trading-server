"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is where the HTTP Json server runs. It is what is used by the CryptoControl terminal to
 * communicate with the trading sever.
 */
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const routes_1 = require("./routes");
const InvalidJWTError_1 = require("src/errors/InvalidJWTError");
const app = express();
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));
// enable all cors
app.use(cors());
// authenticate the user using JWT tokens
app.use((req, _res, next) => {
    const token = req.header('x-jwt');
    const jwtSecret = app.get('secret') || process.env.SERVER_SECRET || 'secret_keyboard_cat';
    if (!token)
        return next();
    // verify the jwt token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err)
            return next(new InvalidJWTError_1.default);
        req.uid = decoded.uid;
        next();
    });
});
// install routes
app.use(routes_1.default);
exports.default = app;
