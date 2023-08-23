'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class dashboard_province extends Model {
    static associate(models) {
    }
  };

  dashboard_province.init({
    province_id: DataTypes.BIGINT,
    dashboard_id: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'dashboard_province',
    tableName: 'dashboard_provinces',
    paranoid: true,
  });

  sequelizePaginate.paginate(dashboard_province);

  return dashboard_province;
};