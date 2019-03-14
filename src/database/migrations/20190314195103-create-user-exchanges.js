'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserExchanges', {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserExchanges');
  }
};
