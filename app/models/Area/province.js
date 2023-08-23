'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class province extends Model {
    static associate(models) {
      models.province.hasMany(models.city, { foreignKey: 'city_id', as: 'city'})
      models.province.belongsToMany(models.dashboard, { foreignKey: 'province_id', as: 'dashboard', through: 'dashboard_provinces'  })
    }
  };

  province.init({
    name: DataTypes.STRING,
    code: DataTypes.BIGINT,
    code_2022: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'province',
    tableName: 'dm_provincies',
    paranoid: true,
  });

  sequelizePaginate.paginate(province);

  return province;
};