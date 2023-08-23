'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class city extends Model {
    static associate(models) {
      models.city.hasMany(models.district, { foreignKey: 'district_id', as: 'district'})
      models.city.belongsTo(models.province, { foreignKey: 'province_id', as: 'province' })
      models.city.belongsToMany(models.dashboard, { foreignKey: 'city_id', as: 'dashboard_city', through: 'dashboard_cities'  })
    }
  };

  city.init({
    province_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('KOTA', 'KABUPATEN'),
    name: DataTypes.STRING,
    code: DataTypes.BIGINT,
    code_2022: DataTypes.BIGINT,
    area: DataTypes.INTEGER,
    population: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'city',
    tableName: 'dm_cities',
    paranoid: true,
  });

  sequelizePaginate.paginate(city);

  return city;
};