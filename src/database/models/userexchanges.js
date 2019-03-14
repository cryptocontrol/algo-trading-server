'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserExchanges = sequelize.define('UserExchanges', {
    uid: DataTypes.STRING,
    exchange: DataTypes.STRING,
    apiKey: DataTypes.STRING,
    apiSecret: DataTypes.STRING,
    apiPassword: DataTypes.STRING
  }, {});
  UserExchanges.associate = function(models) {
    // associations can be defined here
  };
  return UserExchanges;
};