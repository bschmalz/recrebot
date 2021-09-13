import { FORGET_PASSWORD_PREFIX } from 'src/constants';
import { TripRequest } from '../entities/TripRequest';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';
import { sendEmail } from '../utils/sendEmail';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  Field,
  ObjectType,
} from 'type-graphql';
import { v4 } from 'uuid';
import { TripRequestInput } from './types';

// @ObjectType()
// class FieldError {
//   @Field()
//   field: string;

//   @Field()
//   message: string;
// }

@ObjectType()
class TripRequestsResponse {
  @Field(() => [TripRequest], { nullable: true })
  tripRequests?: TripRequest[];
}

@Resolver()
export class TripRequestResolver {
  @Query(() => String)
  tripRequest() {
    return 'trip request';
  }

  @Query(() => TripRequestsResponse)
  @UseMiddleware(isAuth)
  async getTripRequests(
    @Ctx() { req }: MyContext
  ): Promise<TripRequestsResponse> {
    const userId = req.session?.userId;
    const tr = await TripRequest.find({ where: { userId } });
    return { tripRequests: tr };
  }

  @Mutation(() => TripRequest)
  @UseMiddleware(isAuth)
  async createTripRequest(
    @Arg('input') input: TripRequestInput,
    @Ctx() { req }: MyContext
  ): Promise<TripRequest> {
    const tr = {
      userId: req.session?.userId,
      ...input,
    };

    return TripRequest.create(tr).save();
  }
}
