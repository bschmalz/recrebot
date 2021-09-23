import { EmailInput } from 'src/resolvers/EmailInput';

export const validateEmail = (options: EmailInput) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  return null;
};
