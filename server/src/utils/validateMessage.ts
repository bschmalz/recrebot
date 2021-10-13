import { validateEmail } from './validateEmail';

interface ValidateInput {
  email: string;
  subject: string;
  message: string;
}

export const validateMessage = (params: ValidateInput) => {
  if (!params.message.length) {
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
