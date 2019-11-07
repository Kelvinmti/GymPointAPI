import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    console.log(authHeader);
    console.log(token);

    return next();
  } catch (error) {
    console.log(error);
    if (error.name == 'TokenExpiredError')
      return res.status(401).json({ error: 'Expired Token.' });
    
    return res.status(401).json({ error: 'Invalid Token.' });    
  }
};