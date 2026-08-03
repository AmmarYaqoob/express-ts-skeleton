'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'super admin',
        description: 'Super administrator with full access',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: 'user',
        description: 'Standard application user',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', {
      id: [1, 2],
    });
  },
};
