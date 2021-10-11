import { User } from '../entities/User';
import { MyContext } from '../types';
import {
  Resolver,
  Arg,
  Field,
  Mutation,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from 'type-graphql';
import argon2 from 'argon2';
import {
  COOKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  INVITE_USER_PREFIX,
  REGISTER_USER_PREFIX,
} from '../constants';
import { RegisterInput } from './RegisterInput';
import { validateRegister } from '../utils/validateRegister';
import { sendEmail, sendInvite, sendPasswordReset } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { getConnection } from 'typeorm';
import { EmailInput } from './EmailInput';
import { validateEmail } from '../utils/validateEmail';

export const handleRegister = async (options: RegisterInput) => {
  const errors = validateRegister(options);
  if (errors) {
    return { errors };
  }

  const user = await User.findOne({ where: { email: options.email } });

  if (user) {
    return {
      errors: [
        {
          field: 'email',
          message: 'Account with this email already exists',
        },
      ],
    };
  } else {
    const password = await argon2.hash(options.password);

    let savedUser;

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          phone: options.phone,
          email: options.email,
          password,
        })
        .returning('*')
        .execute();

      savedUser = result.raw[0];
    } catch (err) {
      // dupe phone
      if (err.detail.includes('already exists')) {
        return {
          errors: [
            {
              field: 'phone',
              message: 'phone has been taken',
            },
          ],
        };
      }
    }
    return {
      user: savedUser,
    };
  }
};

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class RegisterResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field({ nullable: true })
  success?: boolean;
}

@ObjectType()
class VerifyEmailResponse {
  @Field()
  isValid: boolean;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    } else {
      // Current user is not the requested user, don't show them email
      return '';
    }
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'length must be greater than 2',
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token is expired',
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);

    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    await redis.del(key);

    // login after change pw
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // email is not in db
      return true;
    }

    const token = v4();

    redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 30);

    sendPasswordReset(
      email,
      `${process.env.CORS_ORIGIN}/change-password/${token}`
    );
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    // You are not logged in
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOne(req.session.userId);
    return user;
  }

  @Mutation(() => RegisterResponse)
  async invite(
    @Arg('options') options: EmailInput,
    @Ctx() { redis }: MyContext
  ): Promise<RegisterResponse> {
    const errors = validateEmail(options);
    if (errors) {
      return { errors };
    }

    const user = await User.findOne({ where: { email: options.email } });

    if (user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Account with this email already exists',
          },
        ],
      };
    }

    const token = v4();

    redis.set(
      INVITE_USER_PREFIX + token,
      options.email,
      'ex',
      1000 * 60 * 60 * 24 * 7
    );

    sendInvite(options.email, `${process.env.CORS_ORIGIN}/register/${token}`);

    return {
      success: true,
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    return await handleRegister(options);
  }

  @Query(() => VerifyEmailResponse)
  async verifyInviteToken(
    @Arg('token') token: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<VerifyEmailResponse> {
    const key = INVITE_USER_PREFIX + token;
    const email = (await redis.get(key)) as string;
    return {
      isValid: email?.length ? true : false,
    };
  }

  @Mutation(() => UserResponse)
  async verifyEmail(
    @Arg('token') token: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    const key = REGISTER_USER_PREFIX + token;
    const user = (await redis.get(key)) as string;

    const { phone, email, password } = JSON.parse(user);
    let savedUser;

    try {
      /* Simpler syntax

      User.create({username: options.username,
          email: options.email,
          password: hashedPassword,}).save()
      */

      // This is an example of building out more raw sql type code if needed
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          phone,
          email: email.toLowerCase(),
          password,
        })
        .returning('*')
        .execute();

      savedUser = result.raw[0];
    } catch (err) {
      // dupe phone
      if (err.detail.includes('already exists')) {
        return {
          errors: [
            {
              field: 'phone',
              message: 'phone has been taken',
            },
          ],
        };
      }
    }

    // Store user id session
    // This will keep user logged in
    req.session.userId = savedUser.id;

    return {
      user: savedUser,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ where: { email: lowerEmail } });
    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: "That email doesn't exist",
          },
        ],
      };
    }
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    }
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: Error | undefined) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
