'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Strategies', {
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
      kind: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isDeleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      hasTriggered: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      closedAt: { type: Sequelize.DATE },
      lastTriggeredAt: { type: Sequelize.DATE },
      params: { type: Sequelize.STRING, },
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
    return queryInterface.dropTable('Strategies')
  }
}
