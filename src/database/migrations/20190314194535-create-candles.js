'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Candles', {
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
    })

    await queryInterface.addIndex('Candles', ['symbol', 'exchange', 'start'], {
      type: 'unique',
      name: 'symbol_exchange_start'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Candles')
  }
}
