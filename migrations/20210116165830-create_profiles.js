'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      phone: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ''
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sex: {
        allowNull: true,
        type: Sequelize.ENUM('male', 'female'),
        defaultValue: null
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      province_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      city_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      postal_code: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('profiles');
  }
};