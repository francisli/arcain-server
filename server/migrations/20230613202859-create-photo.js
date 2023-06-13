/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Photos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      ProjectId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Projects',
          key: 'id',
        },
      },
      position: {
        type: Sequelize.INTEGER,
      },
      file: {
        type: Sequelize.STRING,
      },
      fileName: {
        type: Sequelize.STRING,
      },
      desc: {
        type: Sequelize.STRING,
      },
      isVisible: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isVisibleOnHome: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Photos');
  },
};
