"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const advices_1 = require("./models/advices");
const candles_1 = require("./models/candles");
const log_1 = require("src/utils/log");
const plugins_1 = require("./models/plugins");
const trades_1 = require("./models/trades");
const triggers_1 = require("./models/triggers");
const userexchanges_1 = require("./models/userexchanges");
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];
exports.init = () => {
    log_1.default.info('init database');
    const sequelize = new sequelize_typescript_1.Sequelize(config);
    sequelize.addModels([userexchanges_1.default, candles_1.default, trades_1.default, triggers_1.default, plugins_1.default, advices_1.default]);
    return sequelize;
};
