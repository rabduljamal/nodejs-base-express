'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class permission extends Model {
    static associate(models) {
      models.permission.hasMany(models.role, { foreignKey: 'id', as: 'role' })
    //   models.permission.hasMany(models.menuitem, { foreignKey: 'menuitem_id', as: 'menu_item' })
    }
  };

  permission.init({
    mastermenu_id: DataTypes.INTEGER,
    menuitem_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('active', 'inactive'),
  }, {
    sequelize,
    modelName: 'permission',
    tableName: 'permissions',
    paranoid: true,
  });

  sequelizePaginate.paginate(permission);

  return permission;
};