'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class dashboard_district extends Model {
    static associate(models) {
    }
  };

  dashboard_district.init({
    district_id: DataTypes.BIGINT,
    dashboard_id: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'dashboard_district',
    tableName: 'dashboard_districts',
    paranoid: true,
  });

  sequelizePaginate.paginate(dashboard_district);

  return dashboard_district;
};