import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .required()
          .min(6),
      });
  
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Campos obrigatórios inválidos.' });
      }
  
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ error: 'Usuário não existe.' });
      }
  
      if (!(await user.checkPassword(password))) {
        return res.status(400).json({ error: 'Senha inválida.' });
      }
  
      const { id, name } = user;
      
      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });      
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to create session.' });         
    }
  }
}

export default new SessionController();
