'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class oauth_credential extends Model {
    // static associate(models) {
    //   models.chat_rooms.hasMany(models.user_rooms, { foreignKey: 'room_id' })
    //   models.chat_rooms.hasMany(models.conversations, { foreignKey: 'room_id' })
    // }
  };

  oauth_credential.init({
    app_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    provider: DataTypes.ENUM('user', 'client'),
    client_id: DataTypes.TEXT,
    client_secret: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'oauth_credential',
    tableName: 'oauth_credentials',
    paranoid: true
  });

  sequelizePaginate.paginate(oauth_credential);

  return oauth_credential;
};