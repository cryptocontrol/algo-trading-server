"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = require("./HttpError");
class NotFoundError extends HttpError_1.default {
    constructor(message) {
        super(message || 'Page not found');
        this.status = 404;
    }
}
exports.default = NotFoundError;
