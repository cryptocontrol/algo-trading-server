'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Candles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start: {
        uniqur: true,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Candles');
  }
};
