import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required('Campo nome é obrigatório'),
      email: Yup.string()
        .email('Informe um email válido')
        .required('Campo email é obrigatório'),
      idade: Yup.number()
        .required('Campo idade é obrigatório')
        .positive('Campo idade deve ser um número maior que zero')
        .integer(),
      peso: Yup.number()
        .positive('Campo peso deve ser um número maior que zero')
        .required('Campo peso é obrigatório'),
      altura: Yup.number()
        .positive('Campo altura deve ser um número maior que zero')
        .required('Campo altura é obrigatório')
        .typeError('Campo altura deve ser um número'),
    });

    const errosValidacao = [];

    await schema.validate(req.body).catch(err => {
      errosValidacao.push(err.errors);
    });

    if (errosValidacao.length > 0) {
      return res.status(400).json(errosValidacao);
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
