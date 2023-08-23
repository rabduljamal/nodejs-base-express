'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class dashboard_city extends Model {
    static associate(models) {
    }
  };

  dashboard_city.init({
    city_id: DataTypes.BIGINT,
    dashboard_id: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'dashboard_city',
    tableName: 'dashboard_cities',
    paranoid: true,
  });

  sequelizePaginate.paginate(dashboard_city);

  return dashboard_city;
};