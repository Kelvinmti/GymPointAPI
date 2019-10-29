import Sequelize, { Model } from 'sequelize';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.DECIMAL(3, 2),
        altura: Sequelize.DECIMAL(3, 2),
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Students;
