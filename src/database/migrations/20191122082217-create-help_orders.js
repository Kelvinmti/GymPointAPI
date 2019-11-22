'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('help_orders', 
      { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true 
        },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'students', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',          
        },
        question: {
          type: Sequelize.STRING,
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
      },
      {
        uniqueKeys: {
          hlp_ord_unique: {
            fields: ['student_id', 'question']
          }
        }
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('help_orders');
  }
};
