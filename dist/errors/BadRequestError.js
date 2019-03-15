"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = require("./HttpError");
class BadRequestError extends HttpError_1.default {
    constructor(message) {
        super(message || 'Bad Request');
        this.status = 400;
    }
}
exports.default = BadRequestError;
