'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    static associate(models) {
      models.role.hasMany(models.permission, { foreignKey: 'permission_id', as: 'permission' })
      models.role.belongsTo(models.dashboard, { foreignKey: 'dashboard_id', as: 'dashboard' })
      //   models.role.hasMany(models.userrole, { foreignKey: 'userrole_id', as: 'user_role' })
    }
  };

  role.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    dashboard_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('active', 'inactive'),
  }, {
    sequelize,
    modelName: 'role',
    tableName: 'roles',
    paranoid: true,
  });

  sequelizePaginate.paginate(role);

  return role;
};