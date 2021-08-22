import { User } from '../entities/User';
import { MyContext } from 'src/types';
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
  REGISTER_USER_PREFIX,
} from '../constants';
import { UsernamePasswordInput } from './UserPasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { getConnection } from 'typeorm';

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
      console.log('not in db');
      return true;
    }

    const token = v4();

    redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 30);

    sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`,
      'Reset Password'
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
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { redis }: MyContext
  ): Promise<RegisterResponse> {
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
      const token = v4();
      const password = await argon2.hash(options.password);

      redis.set(
        REGISTER_USER_PREFIX + token,
        JSON.stringify({ ...options, password }),
        'ex',
        1000 * 60 * 30
      );

      sendEmail(
        options.email,
        `<a href="http://localhost:3000/verify-email/${token}">Verify your email address</a>`,
        'Verify Your Email Address'
      );

      return {
        success: true,
      };
    }
  }

  // @Mutation(() => UserResponse)
  // async validateRegister(
  //   @Arg('token') token: string,
  //   @Ctx() { req, redis }: MyContext
  // ): Promise<UserResponse> {
  // }

  @Mutation(() => UserResponse)
  async verifyEmail(
    @Arg('token') token: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    console.log('mutate!');

    const key = REGISTER_USER_PREFIX + token;
    const user = (await redis.get(key)) as string;
    const { username, email, password } = JSON.parse(user);
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
          username,
          email,
          password,
        })
        .returning('*')
        .execute();

      savedUser = result.raw[0];
    } catch (err) {
      // dupe username
      if (err.detail.includes('already exists')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'username has been taken',
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
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: "That username or email doesn't exist",
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
