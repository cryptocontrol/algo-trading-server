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
let Advices = class Advices extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Advices.prototype, "symbol", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Advices.prototype, "exchange", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Advices.prototype, "uid", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Advices.prototype, "volume", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Advices.prototype, "price", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Advices.prototype, "advice", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Advices.prototype, "mode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Advices.prototype, "trigger_id", void 0);
Advices = __decorate([
    sequelize_typescript_1.Table({ timestamps: true })
], Advices);
exports.default = Advices;
