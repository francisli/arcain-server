/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE "Photos" ALTER COLUMN "ProjectId" DROP NOT NULL;');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE "Photos" ALTER COLUMN "ProjectId" SET NOT NULL;');
  },
};
