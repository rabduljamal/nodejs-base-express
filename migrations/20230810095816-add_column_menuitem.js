'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('menuitems', 'mastermenu_id', { allownull: false,type: Sequelize.INTEGER,after: 'id'});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('menuitems', 'mastermenu_id');
  }
};
