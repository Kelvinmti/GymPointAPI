import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    try {
      return res.json();
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Error on trying to create orders.' });
    }
}
}

export default new HelpOrderController();
