import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class HelpOrdermail {
  get key() {
    return 'HelpOrdermail';
  }

  async handle({ data }) {
    const { answerOrder } = data;

    await Mail.sendMail({
      to: `${answerOrder.help_order.student.name} <${answerOrder.help_order.student.email}>`,
      subject: 'Você tem uma nova resposta!!',
      template: 'helporder',
      context: {
        student: answerOrder.help_order.student.name,
        question: answerOrder.help_order.question,
        answer: answerOrder.answer,
        dt_answer: format(parseISO(answerOrder.answer_at), 'dd/MM/yyyy', {
          locale: pt,
        }),
      },
    });
  }
}

export default new HelpOrdermail();
