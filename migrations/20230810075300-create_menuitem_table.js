'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('menuitems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      icon: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      route: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      parent: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('active', 'inactive'),
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
      },},);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('menuitems');
  }
};
