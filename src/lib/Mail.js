import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        console.log(this.transporter.options);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }
}

export default new Mail();