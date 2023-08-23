'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class dashboard_subdistrict extends Model {
    static associate(models) {
    }
  };

  dashboard_subdistrict.init({
    subdistrict_id: DataTypes.BIGINT,
    dashboard_id: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'dashboard_subdistrict',
    tableName: 'dashboard_subdistricts',
    paranoid: true,
  });

  sequelizePaginate.paginate(dashboard_subdistrict);

  return dashboard_subdistrict;
};