"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor() {
        super(...arguments);
        this.status = 500;
    }
}
exports.default = HttpError;
