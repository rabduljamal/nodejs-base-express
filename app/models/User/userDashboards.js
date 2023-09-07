'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class userDashboard extends Model {
    static associate(models) {
      // models.userDashboard.belongsTo(models.user, { foreignKey: 'user_id' })
    }
  };

  userDashboard.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    photo: DataTypes.TEXT,
    photo_url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.photo !== null && this.photo !== undefined  ? 'https://'+process.env.MINIO_URL+this.photo : null}`;
      },
      set(value) {
        throw new Error('Do not try to set the `photo_url` value!');
      }
    },
    type: DataTypes.ENUM('internal', 'external'),
    status: DataTypes.ENUM('active', 'inactive'),
    ssoUserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'userDashboard',
    tableName: 'users',
    paranoid: true,
  });

  sequelizePaginate.paginate(userDashboard);

  return userDashboard;
};