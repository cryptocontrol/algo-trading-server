'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candles = sequelize.define('Candles', {
    start: DataTypes.INTEGER,
    open: DataTypes.DOUBLE
  }, {});
  Candles.associate = function(models) {
    // associations can be defined here
  };
  return Candles;
};