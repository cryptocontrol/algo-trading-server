'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Trades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      volume: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      exchange: {
        allowNull: false,
        type: Sequelize.STRING
      },
      symbol: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tradeId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tradedAt: {
        allowNull: false,
        type: Sequelize.DATE
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Trades')
  }
};
