'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('oauth_credentials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      app_name: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      },
      user_id: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null
      },
      client_id: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      client_secret: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      provider: {
        allowNull: false,
        type: Sequelize.ENUM('user', 'client'),
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('oauth_credentials');
  }
};