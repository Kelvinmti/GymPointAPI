import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Name field is required'),
        email: Yup.string()
          .email('Invalid mail.')
          .required('Mail field is required.'),
        age: Yup.number()
          .required('Age field  is required.')
          .positive('Age field must be a number higher than zero.')
          .integer()
          .typeError('Age field must be a number.'),
        weight: Yup.number()
          .positive('Weight field must be a number higher than zero.')
          .required('Weight field is required.'),
        height: Yup.number()
          .positive('Height field must be a number higher than zero.')
          .required('Height field is required.')
          .typeError('Height field must be a number.'),
      });

      const errorMessage = [];
      await schema.validate(req.body).catch(err => {
        errorMessage.push(err.errors);
      });

      if (errorMessage.length > 0)
        return res.status(400).json({ error: errorMessage });
    
      const { id, name, email, age, weight, height, createdAt } = await Student.create(
        req.body
      );
  
      return res.json({
        id,
        name,
        email,
        age,
        weight,
        height, 
        createdAt,
      });      
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to create the student.' });         
    }
  }

  async update(req, res) {
    try {
      if (Object.keys(req.body).length === 0)
        return res.status(400).json('Nothing to update.');

      const { id } = req.params;

      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email('Invalid mail.'),
        age: Yup.number()
          .positive('Age field must be a number higher than zero.')
          .integer()
          .typeError('Age field must be a number.'),
        weight: Yup.number()
          .positive('Weight field must be a number higher than zero.')
          .typeError('Weight field must be a number.'),
        height: Yup.number()
          .positive('Height field must be a number higher than zero.')
          .typeError('Height field must be a number.'),
      });

      const { email } = req.body;

      const errorMessage = [];
      await schema.validate(req.body).catch(err => {
        errorMessage.push(err.errors);
      });

      if (errorMessage.length > 0)
        return res.status(400).json({ error: errorMessage });

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(400).json({ erros: 'Student not found.' });
      }

      if (email && email !== student.email) {
        const studentExists = await Student.findOne({ where: { email } });

        if (studentExists) {
          return res
            .status(400)
            .json({ erros: 'There is a student with this mail already.' });
        }
      }

    
      const { name, age, weight, height, updatedAt } = await student.update(
        req.body
      );
  
      return res.json({ id, name, email, age, weight, height, updatedAt });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to update the student.' });      
    }

  }
}

export default new StudentController();
