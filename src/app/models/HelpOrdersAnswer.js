import Sequelize, { Model } from 'sequelize';

class HelpOrdersAnswer extends Model {
  static init(sequelize) {
    super.init(
      {
        order_id: Sequelize.INTEGER,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.HelpOrder, {
      foreignKey: 'order_id',
      as: 'help_orders',
    });
  }
}

export default HelpOrdersAnswer;
