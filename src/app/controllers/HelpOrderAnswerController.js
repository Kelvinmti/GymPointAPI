import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import HelpOrdersAnswer from '../models/HelpOrdersAnswer';

import Queue from '../../lib/Queue';

class HelpOrderAnswerController {
  async store(req, res) {
    try {
      const { id } = req.params;

      const helpOrder = await HelpOrder.findByPk(id);

      if (!helpOrder) {
        return res.status(400).json({ error: 'Help order not found.' });
      }

      const schema = Yup.object().shape({
        answer: Yup.string().required('Answer field is mandatory.'),
      });

      const errorMessage = [];
      await schema.validate(req.body).catch(err => {
        errorMessage.push(err.errors);
      });

      if (errorMessage.length > 0) {
        return res.status(400).json({ error: errorMessage });
      }

      const { answer } = req.body;

      const helpOrderAnswer = await HelpOrdersAnswer.create({
        order_id: id,
        answer,
        answer_at: new Date(),
      });

      return res.json(helpOrderAnswer);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to create orders answers.' });
    }
  }
}

export default new HelpOrderAnswerController();
