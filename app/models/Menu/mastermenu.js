'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class mastermenu extends Model {
    static associate(models) {
    //   models.profile.belongsTo(models.user, { foreignKey: 'user_id' })
    }
  };

  mastermenu.init({
    name: DataTypes.STRING,
    status: DataTypes.ENUM('active', 'inactive'),
  }, {
    sequelize,
    modelName: 'mastermenu',
    tableName: 'mastermenus',
    paranoid: true,
  });

  sequelizePaginate.paginate(mastermenu);

  return mastermenu;
};