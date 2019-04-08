'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Advices', {
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
            symbol: {
                allowNull: false,
                type: Sequelize.STRING
            },
            advice: {
                allowNull: false,
                type: Sequelize.STRING
            },
            price: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            volume: {
                allowNull: false,
                type: Sequelize.DOUBLE
            },
            mode: {
                allowNull: false,
                type: Sequelize.STRING
            },
            trigger_id: {
                type: Sequelize.INTEGER
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
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Advices');
    }
};
