import { RegisterInput } from 'src/resolvers/RegisterInput';

export const validateRegister = (options: RegisterInput) => {
  if (options.phone.length && options.phone.length !== 10) {
    return [
      {
        field: 'phone',
        message: 'length must be 10',
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: 'password',
        message: 'length must be greater than 2',
      },
    ];
  } else return null;
};
