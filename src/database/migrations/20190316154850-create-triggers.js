'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Triggers', {
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
      orderId: {
        type: Sequelize.STRING
      },
      kind: {
        allowNull: false,
        type: Sequelize.STRING
      },
      targetPrice: {
        type: Sequelize.DOUBLE,
      },
      hasTriggered: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      params: {
        type: Sequelize.STRING,
      },
      triggeredAt: {
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Triggers')
  }
}
