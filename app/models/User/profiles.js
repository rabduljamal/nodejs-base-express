'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    static associate(models) {
      models.profile.belongsTo(models.user, { foreignKey: 'user_id' })
    }
  };

  profile.init({
    user_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    photo: DataTypes.TEXT,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    full_name: DataTypes.STRING,
    sex: DataTypes.ENUM('male', 'female'),
    address: DataTypes.STRING,
    province_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    postal_code: DataTypes.INTEGER,
    photo_url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.photo !== null && this.photo !== undefined  ? 'https://'+process.env.MINIO_URL+this.photo : null}`;
      },
      set(value) {
        throw new Error('Do not try to set the `photo_url` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'profile',
    tableName: 'profiles',
    paranoid: true,
  });

  sequelizePaginate.paginate(profile);

  return profile;
};