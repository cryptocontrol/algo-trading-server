"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = require("./HttpError");
class RateLimitExceededError extends HttpError_1.default {
    constructor(message) {
        super(message || 'Rate Limit Exceeded');
        this.status = 403;
    }
}
exports.default = RateLimitExceededError;
