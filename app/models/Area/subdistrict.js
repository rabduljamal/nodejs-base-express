'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class subdistrict extends Model {
    static associate(models) {
      models.subdistrict.belongsTo(models.district, { foreignKey: 'district_id', as: 'district' })
      models.subdistrict.belongsToMany(models.dashboard, { foreignKey: 'subdistrict_id', as: 'dashboard_subdistrict', through: 'dashboard_subdistricts'  })
    }
  };

  subdistrict.init({
    district_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: DataTypes.BIGINT,
    code_2022: DataTypes.BIGINT,
    area: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT    
  }, {
    sequelize,
    modelName: 'subdistrict',
    tableName: 'dm_subdistricts',
    paranoid: true,
  });

  sequelizePaginate.paginate(subdistrict);

  return subdistrict;
};