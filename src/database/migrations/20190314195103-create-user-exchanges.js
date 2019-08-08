'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserExchanges', {
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
      }
    })

    await queryInterface.addIndex('UserExchanges', ['uid', 'exchange'], {
      type: 'unique',
      name: 'uid_exchange'
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserExchanges')
  }
}
