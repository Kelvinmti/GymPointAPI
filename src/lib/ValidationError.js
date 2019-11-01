import * as Yup from 'yup';
// implementar classe dinamica de validacao se basear em: https://codesandbox.io/s/clever-snyder-1u410?fontsize=14

class ValidationError {
  async checkErrors(patternFields, fieldsToValidate) {
    try {
      const schema = Yup.object().shape(patternFields);

      const errorMessage = [];
      await schema.validate(fieldsToValidate).catch(err => {
        errorMessage.push(err.errors);
      });
      return errorMessage;
    } catch (error) {
      return error;
    }
  }
}

export default new ValidationError();
