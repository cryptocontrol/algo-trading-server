"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let Candles = class Candles extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Candles.prototype, "symbol", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Candles.prototype, "exchange", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Candles.prototype, "open", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Candles.prototype, "high", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Candles.prototype, "low", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Candles.prototype, "volume", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Candles.prototype, "close", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Candles.prototype, "vwp", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Candles.prototype, "start", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Candles.prototype, "trades", void 0);
Candles = __decorate([
    sequelize_typescript_1.Table({ timestamps: true })
], Candles);
exports.default = Candles;
