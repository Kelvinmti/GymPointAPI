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

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ erros: err.errors });
    });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({
    //     error: 'Campos obrigatórios inválidos ou não preenchidos corretamente.',
    //   });
    // }

    const { id, nome, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      nome,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email('Informe um email válido'),
      idade: Yup.number()
        .positive('Campo idade deve ser um número maior que zero')
        .integer()
        .typeError('Campo idade deve ser um número'),
      peso: Yup.number()
        .positive('Campo peso deve ser um número maior que zero')
        .typeError('Campo peso deve ser um número'),
      altura: Yup.number()
        .positive('Campo altura deve ser um número maior que zero')
        .typeError('Campo altura deve ser um número'),
    });

    const { email } = req.body;

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ erros: err.errors });
    });

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ erros: 'Aluno não encontrado.' });
    }

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res
          .status(400)
          .json({ erros: 'Já existe um aluno com o email informado.' });
      }
    }

    const { nome, idade, peso, altura, updated_at } = await student.update(
      req.body
    );

    return res.json({ id, nome, email, idade, peso, altura, updated_at });
  }
}

export default new StudentController();
