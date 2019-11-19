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
      subject: 'Matrícula Confirmada!!',
      template: 'enrollment',
      context: {
        student: enrollment.student.name,
        plan: enrollment.plan.title,
        dt_ini_enrollment: format(
          parseISO(enrollment.start_date),
          'dd/MM/YYYY',
          {
            locale: pt,
          }
        ),
        dt_end_enrollment: format(parseISO(enrollment.end_date), 'dd/MM/YYYY', {
          locale: pt,
        }),
        valor: enrollment.price,
      },
    });
  }
}

export default new EnrollmentMail();
