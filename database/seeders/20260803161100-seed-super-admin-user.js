'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = bcrypt.hashSync('Admin@123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: '00000000-0000-4000-a000-000000000001',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        contactNo: '0000000000',
        password: passwordHash,
        isActive: true,
        isLocked: false,
        isVerified: true,
        roleId: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: 'superadmin@example.com',
    });
  },
};
