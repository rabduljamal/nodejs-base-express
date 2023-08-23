'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class menuitem extends Model {
    static associate(models) {
    //   models.profile.belongsTo(models.user, { foreignKey: 'user_id' })
    }
  };

  menuitem.init({
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    route: DataTypes.STRING,
    parent: DataTypes.INTEGER,
    status: DataTypes.ENUM('active', 'inactive'),
  }, {
    sequelize,
    modelName: 'menuitem',
    tableName: 'menuitems',
    paranoid: true,
  });

  sequelizePaginate.paginate(menuitem);

  return menuitem;
};