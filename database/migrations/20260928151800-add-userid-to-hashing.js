'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hashing', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addIndex('hashing', ['userId', 'type'], {
      name: 'hashing_user_id_type',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('hashing', 'hashing_user_id_type');
    await queryInterface.removeColumn('hashing', 'userId');
  },
};
