import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required('Title field is required.'),
        duration: Yup.number()
          .required('Duration field is required.')
          .positive('Duration field must be a number higher than zero.')
          .integer('Duration field must be an integer number.')
          .typeError('Duration field must be a number.'),
        price: Yup.number()
          .required('Price field is required.')
          .typeError('Price field must be a number.'),
      });

      await schema.validate(req.body).catch(err => {
        return res.status(400).json({ error: err.errors });
      });

    
      const { id, title, duration, price, createdAt } = await Plan.create(
        req.body
      );

      return res.json({
          id,
          title,
          duration,
          price,
          createdAt,
      });
    } catch (error) {
      console.log(error);
      return res.json({ error: 'Error on trying to create the plan.' });
    }
  }

  async update(req, res) {
    try {
      if (Object.keys(req.body).length === 0)
      return res.status(400).json('Nothing to update.');

      const schema = Yup.object().shape({
        title: Yup.string(),
        duration: Yup.number()
          .positive('Duration field must be a number higher than zero.')
          .integer('Duration field must be an integer.')
          .typeError('Duration field must be a number.'),
        price: Yup.number().typeError('Price field must be a number.'),
      });

      await schema.validate(req.body).catch(err => {
        return res.status(400).json({ error: err.errors });
      });

      const plan = await Plan.findByPk(req.params.id);

      if (!plan) {
        return res.status(400).json({ error: 'Plan does not found.' });
      }

      const { title, duration, price, updatedAt } = await plan.update(req.body);

      return res.json({
        title,
        duration,
        price,
        updatedAt,
      });      
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to update the plan.' });           
    }
  }

  async delete(req, res) {
    try {
      const plan = await Plan.findByPk(req.params.id);

      if (!plan) {
        return res.status(400).json({ error: 'Plan does not exists.' });
      }    
      await plan.destroy();
      return res.json({ msg: 'Plan deleted successfully!' });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to delete the plan.' });
    }
}
}

export default new PlanController();
