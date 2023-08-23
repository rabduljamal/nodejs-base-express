'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class district extends Model {
    static associate(models) {
      models.district.hasMany(models.subdistrict, { foreignKey: 'subdistrict_id', as: 'subdistrict'})
      models.district.belongsTo(models.city, { foreignKey: 'city_id', as: 'city' })
      models.district.belongsToMany(models.dashboard, { foreignKey: 'district_id', as: 'dashboard_district', through: 'dashboard_districts'  })
    }
  };

  district.init({
    city_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: DataTypes.BIGINT,
    code_2022: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'district',
    tableName: 'dm_districts',
    paranoid: true,
  });

  sequelizePaginate.paginate(district);

  return district;
};