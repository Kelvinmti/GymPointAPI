import * as Yup from 'yup';
import { parseISO, isBefore, addMonths } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async store(req, res) {

    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required('student field is mandatory.')
        .positive('student field must be a number higher than zero.')
        .integer('student field must be an integer.')
        .typeError('student field must be a number.'),
      plan_id: Yup.number()
        .required('plan field is mandatory.')
        .positive('plan field must be a number higher than zero.')
        .integer('plan field must be an integer.')
        .typeError('plan field must be a number.'),
      start_date: Yup.date()
        .required('start date field is mandatory.')
        .typeError('start date field must be a valid date.'),
    });

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ error: err.errors });
    });
    
    const { student_id, plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);
    
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found.' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const start_date_formated = parseISO(start_date);

    if (isBefore(start_date_formated, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const end_date = addMonths(start_date_formated, plan.duration);

    const total_price = plan.price * plan.duration;

    try {
      const { created_at } = await Enrollment.create({
        student_id,
        plan_id,
        start_date: start_date_formated,
        end_date,
        price: total_price
      });
  
      res.json({
        student_id,
        plan_id,
        start_date_formated,
        end_date,
        total_price,
        created_at
      });      
    } catch (error) {
      return res.status(400).json({ error });
    }
    
  }
}

export default new EnrollmentController();
