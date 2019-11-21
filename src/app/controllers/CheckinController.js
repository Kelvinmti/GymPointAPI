import { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const dataCheckin = new Date();

    const findCheckins = await Checkin.findOne({ 
      where: { 
        student_id: id,
        created_at: {
          [Op.between]: [startOfDay(data), endOfDay(subDays(dataCheckin, 7))]
        } 
      } 
    });

    if (findCheckins) {
      return res.status(400).json({ error: 'Student cannot to checkin anymore.' });
    }    

    const checkin = await Checkin.create({
      student_id: id
    });

    return res.json({
      checkin,
    });

  }
}

export default new CheckinController();
