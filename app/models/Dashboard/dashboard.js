'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class dashboard extends Model {
    static associate(models) {
      models.dashboard.hasMany(models.banner, { foreignKey: 'banner_id', as: 'banner' })
      models.dashboard.hasMany(models.role, { foreignKey: 'id', as: 'role' })
      models.dashboard.belongsTo(models.mastermenu, { foreignKey: 'mastermenu_id', as: 'mastermenu' })
      models.dashboard.belongsToMany(models.province, { foreignKey: 'dashboard_id', as: 'province', through: 'dashboard_provinces'  })
      models.dashboard.belongsToMany(models.city, { foreignKey: 'dashboard_id', as: 'city', through: 'dashboard_cities'  })
      models.dashboard.belongsToMany(models.district, { foreignKey: 'dashboard_id', as: 'district', through: 'dashboard_districts'  })
      models.dashboard.belongsToMany(models.subdistrict, { foreignKey: 'dashboard_id', as: 'subdistrict', through: 'dashboard_subdistricts'  })
    }
  };

  dashboard.init({
    title: DataTypes.STRING,
    headline: DataTypes.STRING,
    wildcard: DataTypes.STRING,
    logo: DataTypes.TEXT,
    emblem: DataTypes.TEXT,
    tema: DataTypes.TEXT,
    provinces: DataTypes.TEXT,
    cities: DataTypes.TEXT,
    districts: DataTypes.TEXT,
    subdistricts: DataTypes.TEXT,
    status: DataTypes.ENUM('active', 'inactive'),
    mastermenu_id: DataTypes.INTEGER,
    logo_url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.logo !== null && this.logo !== undefined  ? 'https://'+process.env.MINIO_URL+this.logo : null}`;
      },
      set(value) {
        throw new Error('Do not try to set the `logo_url` value!');
      }
    },
    emblem_url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.emblem !== null && this.emblem !== undefined  ? 'https://'+process.env.MINIO_URL+this.emblem : null}`;
      },
      set(value) {
        throw new Error('Do not try to set the `emblem_url` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'dashboard',
    tableName: 'dashboards',
    paranoid: true,
  });

  sequelizePaginate.paginate(dashboard);

  return dashboard;
};