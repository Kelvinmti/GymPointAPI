import { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';
import PagingHelper from '../../lib/PagingHelper';

class CheckinController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const checkins = await Checkin.findAll({
        attributes: [['created_at', 'checkin_date']],
        order: [['created_at', 'desc']],
        limit: PagingHelper.MaxRows,
        offset: (page - 1) * PagingHelper.MaxRows,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name'],
          },
        ],
      });

      return res.json(checkins);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to list checkins.' });
    }
  }

  async store(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(400).json({ error: 'Student not found.' });
      }

      const dataCheckin = new Date();

      const qtdCheckins = await Checkin.count({
        where: {
          student_id: id,
          created_at: {
            [Op.between]: [
              startOfDay(subDays(dataCheckin, 7)),
              endOfDay(dataCheckin),
            ],
          },
        },
      });

      console.log(qtdCheckins);

      if (qtdCheckins === 5) {
        return res.status(400).json({
          error:
            "You have already exceeded the maximum of 7 checkin's in the last 7 days.",
        });
      }

      const checkin = await Checkin.create({
        student_id: id,
      });

      return res.json({
        checkin,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to save checkin.' });
    }
  }
}

export default new CheckinController();
