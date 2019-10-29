module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('students', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      idade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      peso: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
      },
      altura: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('students');
  },
};
