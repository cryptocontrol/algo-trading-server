'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.createTable('UserExchanges', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            uid: {
                allowNull: false,
                type: Sequelize.STRING
            },
            exchange: {
                allowNull: false,
                type: Sequelize.STRING
            },
            apiKey: {
                allowNull: false,
                type: Sequelize.STRING
            },
            apiSecret: {
                allowNull: false,
                type: Sequelize.STRING
            },
            apiPassword: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
        });
        yield queryInterface.addIndex('UserExchanges', ['uid', 'exchange'], {
            type: 'unique',
            name: 'uid_exchange'
        });
    }),
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('UserExchanges');
    }
};
