'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      phone: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      photo: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('internal', 'external'),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('active', 'inactive'),
      },
      ssoUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      // role: {
      //   allowNull: false,
      //   type: Sequelize.ENUM('superadmin', 'admin', 'user'),
      // },
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
    await queryInterface.dropTable('users');
  }
};