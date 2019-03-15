"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BadRequestError_1 = require("./BadRequestError");
class NotAuthorizedError extends BadRequestError_1.default {
    constructor(message) {
        super('You are not authorised to access this page');
        this.status = 401;
    }
}
exports.default = NotAuthorizedError;
