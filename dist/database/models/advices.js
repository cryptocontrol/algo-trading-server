'use strict';
module.exports = (sequelize, DataTypes) => {
    const Advices = sequelize.define('Advices', {
        start: DataTypes.INTEGER,
        open: DataTypes.DOUBLE
    }, {});
    Advices.associate = function (models) {
        // associations can be defined here
    };
    return Advices;
};
