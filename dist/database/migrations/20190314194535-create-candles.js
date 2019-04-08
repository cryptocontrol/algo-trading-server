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
        yield queryInterface.createTable('Candles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            start: {
                allowNull: false,
                type: Sequelize.DATE
            },
            open: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            high: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            low: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            close: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            vwp: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            volume: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            trades: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            exchange: {
                allowNull: false,
                type: Sequelize.STRING
            },
            symbol: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
        yield queryInterface.addIndex('Candles', ['symbol', 'exchange', 'start'], {
            type: 'unique',
            name: 'symbol_exchange_start'
        });
    }),
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Candles');
    }
};
