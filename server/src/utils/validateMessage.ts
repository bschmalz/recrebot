import { validateEmail } from './validateEmail';

interface ValidateInput {
  email: string;
  subject: string;
  message: string;
}

export const validateMessage = (params: ValidateInput) => {
  if (!params.subject.length) {
    return [
      {
        field: 'subject',
        message: 'must contain a subject',
      },
    ];
  } else if (!params.message.length) {
    return [
      {
        field: 'message',
        message: 'must contain a message',
      },
    ];
  } else {
    return validateEmail(params);
  }
};
