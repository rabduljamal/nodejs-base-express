'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class banner extends Model {
    static associate(models) {
      models.profile.belongsTo(models.dashboard, { foreignKey: 'dashboard_id' })
    }
  };

  banner.init({
    dashboard_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    sort: DataTypes.INTEGER,
    url: DataTypes.TEXT,
    status: DataTypes.ENUM('active', 'inactive'),
    image: DataTypes.TEXT,
    image_url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.image !== null && this.image !== undefined  ? 'https://'+process.env.MINIO_URL+this.image : null}`;
      },
      set(value) {
        throw new Error('Do not try to set the `image_url` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'banner',
    tableName: 'banners',
    paranoid: true,
  });

  sequelizePaginate.paginate(banner);

  return banner;
};