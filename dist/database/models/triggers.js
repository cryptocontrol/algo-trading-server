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
let Triggers = class Triggers extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Triggers.prototype, "symbol", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Triggers.prototype, "exchange", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Triggers.prototype, "targetPrice", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Triggers.prototype, "targetVolume", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Triggers.prototype, "uid", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Triggers.prototype, "kind", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Triggers.prototype, "lastTriggeredAt", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Triggers.prototype, "params", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Triggers.prototype, "hasTriggered", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Triggers.prototype, "closedAt", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Triggers.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Triggers.prototype, "orderId", void 0);
Triggers = __decorate([
    sequelize_typescript_1.Table({ timestamps: true })
], Triggers);
exports.default = Triggers;
