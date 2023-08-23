'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dm_subdistricts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      district_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      code: {
        allowNull: true,
        type: Sequelize.BIGINT,
      },
      code_2022: {
        allowNull: true,
        type: Sequelize.BIGINT,
      },
      area: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      lat: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      long: {
        allowNull: true,
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('dm_subdistricts');
  }
};