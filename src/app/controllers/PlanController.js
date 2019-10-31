import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required('Campo title é obrigatório.'),
      duration: Yup.number()
        .required('Campo duration é obrigatório.')
        .positive('Campo duration deve ser um número maior que zero.')
        .integer('Campo duration deve ser um valor inteiro.')
        .typeError('Campo duration deve ser um valor numérico.'),
      price: Yup.number()
        .required('Campo price é obrigatório.')
        .typeError('Campo price deve ser um valor numérico.'),
    });

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ error: err.errors });
    });

    try {
      const { id, title, duration, price, created_at } = await Plan.create(
        req.body
      );
  
      return res.json({
        id,
        title,
        duration,
        price,
        created_at,
      });      
    } catch (error) {
      return res.json({ error });      
    }
    
  }

  async update(req, res) {

    if (Object.keys(req.body).length === 0)
      return res.status(400).json('Nothing to update.');

    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .positive('duration field must be a number higher than zero.')
        .integer('duration field must be an integer.')
        .typeError('duration field must be a number.'),
      price: Yup.number().typeError('price field must be a number.'),
    });

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ error: err.errors });
    });

    console.log(req.body);

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not found.' });
    }

    const { title, duration, price, updated_at } = await plan.update(
      req.body
    );

    return res.json({
      title,
      duration,
      price,
      updated_at,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists.' });
    }

    try {
      await plan.destroy();
      return res.json({ msg: 'Plan deleted successfully!' });
    } catch (error) {
      return res.status(400).json({ error: 'Error on trying to delete the plan.' });
    }
    
  }

}

export default new PlanController();
