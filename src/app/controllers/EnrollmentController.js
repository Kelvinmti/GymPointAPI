import * as Yup from 'yup';
import { parseISO, isBefore, addMonths } from 'date-fns';
import { Op } from 'sequelize';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';

class EnrollmentController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const enrollments = await Enrollment.findAll({
        attributes: ['id', 'start_date', 'end_date', 'price'],
        order: [['created_at', 'desc']],
        limit: 20, // paginacao
        offset: (page - 1) * 20, // paginacao
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name'],
          },
          {
            model: Plan,
            as: 'plan',
            attributes: ['id', 'title'],
          },
        ],
      });

      return res.json(enrollments);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to find the enrollments.' });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        plan_id: Yup.number()
          .required('Plan field is mandatory.')
          .positive('Plan field must be a number higher than zero.')
          .integer('Plan field must be an integer number.')
          .typeError('Plan field must be a number.'),
        start_date: Yup.date()
          .required('Start date field is mandatory.')
          .typeError('Start date field must be a valid date.'),
      });

      const errorMessage = [];
      await schema.validate(req.body).catch(err => {
        errorMessage.push(err.errors);
      });

      if (errorMessage.length > 0)
        return res.status(400).json({ error: errorMessage });

      const { student_id, plan_id, start_date } = req.body;

      const plan = await Plan.findByPk(plan_id);

      if (!plan) {
        return res.status(400).json({ error: 'Plan not found.' });
      }

      const student = await Student.findByPk(student_id);
      if (!student) {
        return res.status(400).json({ error: 'Student not found.' });
      }

      const findEnrollment = await Enrollment.findOne({
        where: {
          student_id,
          end_date: {
            [Op.gte]: new Date(),
          },
        },
      });

      if (findEnrollment) {
        return res.status(400).json({
          error:
            'There is already a valid enrollment for the student informed.',
        });
      }

      const start_date_formated = parseISO(start_date);

      if (isBefore(start_date_formated, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted.' });
      }

      const end_date = addMonths(start_date_formated, plan.duration);

      const total_price = plan.price * plan.duration;

      const { id, price, createdAt } = await Enrollment.create({
        student_id,
        plan_id,
        start_date: start_date_formated,
        end_date,
        price: total_price,
      });

      const inserted = await Enrollment.findByPk(id);

      await Queue.add(EnrollmentMail.key, {
        inserted,
      });

      return res.json({
        student_id,
        plan_id,
        start_date: start_date_formated,
        end_date,
        price,
        createdAt,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to create the enrollment.' });
    }
  }

  async update(req, res) {
    try {
      if (Object.keys(req.body).length === 0)
        return res.json('Nothing to update.');

      const schema = Yup.object().shape({
        plan_id: Yup.number()
          .positive('Plan field must be a number higher than zero.')
          .integer('Plan field must be an integer number.')
          .typeError('Plan field must be a number.'),
        start_date: Yup.date().typeError(
          'Start date field must be a valid date.'
        ),
      });

      const errorMessage = [];
      await schema.validate(req.body).catch(err => {
        errorMessage.push(err.errors);
      });

      if (errorMessage.length > 0)
        return res.status(400).json({ error: errorMessage });

      const { id } = req.params;

      const findEnroll = await Enrollment.findByPk(id);

      if (!findEnroll) {
        return res.status(400).json({ error: 'Enrollment not found.' });
      }

      const { plan_id, start_date } = req.body;

      const plan = await Plan.findByPk(plan_id);

      if (!plan) {
        return res.status(400).json({ error: 'Plan not found.' });
      }

      let start_date_formated = findEnroll.start_date;
      if (start_date && start_date != findEnroll.start_date) {
        start_date_formated = parseISO(start_date);
      }

      // se start_date não for passado no req, coloco o mesmo valor atual e sera validado
      // pois se for alterado o plano por exemplo, a vigência deverá ser modificada
      if (isBefore(start_date_formated, new Date())) {
        return res.status(400).json({
          error: `Past dates are not permitted: ${start_date_formated}.`,
        });
      }

      let { end_date } = findEnroll;

      let total_price = findEnroll.price;

      if (findEnroll.plan_id != plan_id) {
        end_date = addMonths(start_date_formated, plan.duration);
        total_price = plan.price * plan.duration;
      }

      const { student_id, price, updatedAt } = findEnroll.update({
        plan_id,
        start_date: start_date_formated,
        end_date,
        price: total_price,
      });

      return res.json({
        student_id,
        plan_id,
        start_date: start_date_formated,
        end_date,
        price,
        updatedAt,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to update the enrollment.' });
    }
  }

  async delete(req, res) {
    try {
      const enrollment = await Enrollment.findByPk(req.params.id);

      if (!enrollment) {
        return res.status(400).json({ error: 'Enrollment does not exists.' });
      }

      await enrollment.destroy();

      return res.json({ msg: 'Enrollment deleted successfully!' });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to delete the enrollment.' });
    }
  }
}

export default new EnrollmentController();
