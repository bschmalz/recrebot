import { RegisterInput } from '../resolvers/RegisterInput';

export const validateRegister = (options: RegisterInput) => {
  try {
    if (options.phone.length) {
      if (options.phone.length !== 10) {
        return [
          {
            field: 'phone',
            message: 'length must be 10',
          },
        ];
      }
      if (!/^[0-9]+$/g.test(options.phone)) {
        return [
          {
            field: 'phone',
            message: 'must only be numbers',
          },
        ];
      }
    }

    if (options.password.length <= 2) {
      return [
        {
          field: 'password',
          message: 'length must be greater than 2',
        },
      ];
    } else return null;
  } catch (e) {
    return null;
  }
};
