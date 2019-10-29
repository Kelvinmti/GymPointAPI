import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .required()
        .typeError('Campo Nome é obrigatório'),
      email: Yup.string()
        .email()
        .required()
        .typeError('Campo Email é obrigatório'),
      idade: Yup.number()
        .required()
        .positive()
        .integer()
        .typeError('Campo Email é obrigatório'),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    const errosValidacao = [];

    schema.validate(req.body).catch(err => {
      errosValidacao;
    });

    if (errosValidacao.length > 0) {
      return res.status(400).json({
        erros: err.errors,
      });
    }
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({
    //     error: 'Campos obrigatórios inválidos ou não preenchidos corretamente.',
    //   });
    // }

    const { id, nome, email, idade, peso, altura } = await Student.create(
      req.body
    );

    console.log(`Salvo pelo usuario: ${req.body.userId}`);

    return res.json({
      id,
      nome,
      email,
      idade,
      peso,
      altura,
    });
  }
}

export default new StudentController();
