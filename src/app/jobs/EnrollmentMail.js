import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    // criando variavel de acesso sem constructor
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Bem-vindo a GymPoint!!!',
      template: 'enrollment',
      context: {
        student: enrollment.student.name,
        plan: enrollment.plan.title,
        duration: enrollment.plan.duration,
        dt_ini_enrollment: format(
          parseISO(enrollment.start_date),
          'dd/MM/yyyy',
          {
            locale: pt,
          }
        ),
        dt_end_enrollment: format(parseISO(enrollment.end_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        valor: new Intl.NumberFormat('pt-BR').format(enrollment.price),
      },
    });
  }
}

export default new EnrollmentMail();
