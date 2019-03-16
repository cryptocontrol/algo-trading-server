'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trades', {
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
      side: {
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
    })


    await queryInterface.addIndex('Trades', ['symbol', 'exchange', 'tradeId'], {
      type: 'unique',
      name: 'symbol_exchange_tid'
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Trades')
  }
};
