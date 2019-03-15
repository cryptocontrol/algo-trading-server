"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = require("./HttpError");
class InvalidAPIKeyError extends HttpError_1.default {
    constructor(message) {
        super(message || 'Invalid API Key');
        this.status = 401;
    }
}
exports.default = InvalidAPIKeyError;
