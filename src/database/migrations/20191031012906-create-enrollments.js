module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('enrollments', {
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'students', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'plans', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(7, 2),
        allowNull: false,        
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('enrollments');
  },
};
