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
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .positive('Campo duration deve ser um número maior que zero.')
        .integer('Campo duration deve ser um valor inteiro.')
        .typeError('Campo duration deve ser um valor numérico.'),
      price: Yup.number().typeError('Campo price deve ser um valor numérico.'),
    });

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ error: err.errors });
    });

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plano não encontrado.' });
    }

    const { id, title, duration, price, updated_at } = await plan.update(
      req.body
    );

    return res.json({
      id,
      title,
      duration,
      price,
      updated_at,
    });
  }
}

export default new PlanController();
