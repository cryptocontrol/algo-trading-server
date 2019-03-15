"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const userexchanges_1 = require("./models/userexchanges");
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
//   })
//   .forEach(file => {
//     const model = sequelize['import'](path.join(__dirname, file))
//     db[model.name] = model
//   })
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db)
//   }
// })
exports.init = () => {
    console.log('init database');
    const sequelize = new sequelize_typescript_1.Sequelize(config);
    sequelize.addModels([userexchanges_1.default]);
    // sequelize.import('./models/userexchanges')
    return sequelize;
};
