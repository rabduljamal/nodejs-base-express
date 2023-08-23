'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('dashboards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      headline: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      wildcard: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      logo: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      emblem: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      tema: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      provinces: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      cities: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      districts: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      subdistricts: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('active', 'inactive'),
      },
      mastermenu_id: {
        allowNull: false,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('dashboards');
  }
};
