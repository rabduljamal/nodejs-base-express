'use strict';
const { Model } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      models.user.hasOne(models.profile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE', hooks: true })
    }
  };

  user.init({
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    role: DataTypes.ENUM('superadmin', 'admin', 'user')
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    paranoid: true,
    hooks: {
      afterDestroy: function (instance, options) {
        instance.getProfile().then(profile => profile?.destroy()); // Softdelete on project_user table
        console.log('after destroy: destroyed');
      }
    }
  });

  sequelizePaginate.paginate(user);

  return user;
};