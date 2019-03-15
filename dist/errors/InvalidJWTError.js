"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = require("./HttpError");
class InvalidJWTError extends HttpError_1.default {
    constructor(message) {
        super(message || 'Invalid JWT; Please check your server secret');
        this.status = 401;
    }
}
exports.default = InvalidJWTError;
