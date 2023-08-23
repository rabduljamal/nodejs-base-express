'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('profiles', 'photo', { type: Sequelize.TEXT, defaultValue: null});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('profiles', 'photo');
  }
};
