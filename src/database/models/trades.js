'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trades = sequelize.define('Trades', {
    start: DataTypes.INTEGER,
    open: DataTypes.DOUBLE
  }, {});
  Trades.associate = function(models) {
    // associations can be defined here
  };
  return Trades;
};