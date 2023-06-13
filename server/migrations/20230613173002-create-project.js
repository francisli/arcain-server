/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      link: {
        allowNull: false,
        type: Sequelize.CITEXT,
      },
      desc: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      isVisible: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      position: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('Projects', ['link'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  },
};
