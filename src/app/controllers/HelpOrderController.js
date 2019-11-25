import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import PagingHelper from '../../lib/PagingHelper';

class HelpOrderController {
  async index(req, res) {
    try {
      const { id } = req.params;

      const { page = 1 } = req.query;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(400).json({ error: 'Student not found.' });
      }

      const helpOrders = await HelpOrder.findAll({
        where: {
          student_id: id,
        },
        attributes: ['question', ['created_at', 'question_date']],
        order: [['created_at', 'desc']],
        limit: PagingHelper.MaxRows, // paginacao
        offset: (page - 1) * PagingHelper.MaxRows, // paginacao
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name', 'email'],
          },
        ],
      });
      return res.json(helpOrders);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Error on trying to list orders.' });
    }
  }

  async store(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(400).json({ error: 'Student not found.' });
      }

      const schema = Yup.object().shape({
        question: Yup.string().required('Question field is mandatory.'),
      });

      const errorMessage = [];
      await schema.validate(req.body).catch(err => {
        errorMessage.push(err.errors);
      });

      if (errorMessage.length > 0) {
        return res.status(400).json({ error: errorMessage });
      }

      const { question } = req.body;

      const helpOrder = await HelpOrder.create({
        student_id: id,
        question,
      });

      return res.json(helpOrder);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to create orders.' });
    }
  }
}

export default new HelpOrderController();
