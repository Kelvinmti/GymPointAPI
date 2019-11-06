import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data;
    console.log('A fila executou');

    await Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Bem-vindo a GymPoint!!!',
      text: 'Matrícula efetuada com sucesso!',
      template: 'enrollment',
      context: {
        student: enrollment.student.name,
        plan: enrollment.plan.title,
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
      },
    });
  }
}

export default new EnrollmentMail();
