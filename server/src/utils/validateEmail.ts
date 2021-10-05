import { EmailInput } from 'src/resolvers/EmailInput';

export const validateEmail = (options: EmailInput) => {
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(options.email)) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  return null;
};
