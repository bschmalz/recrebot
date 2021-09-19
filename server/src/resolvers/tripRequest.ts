import { TripRequest } from '../entities/TripRequest';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  Field,
  ObjectType,
  FieldResolver,
  Root,
  InputType,
  Int,
} from 'type-graphql';
import { EditTripRequestInput, TripRequestInput } from './types';
import { Reservable } from '../entities/Reservable';
import { Campground } from '../entities/Campground';
import { Trailhead } from '../entities/Trailhead';

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

@Resolver(TripRequest)
export class TripRequestResolver {
  @FieldResolver(() => [Reservable])
  async locations(@Root() tripRequest: TripRequest) {
    const { locations, type } = tripRequest;
    if (type === 'Camp') {
      return Campground.findByIds(locations);
    } else {
    }
    if (type === 'Hike') {
      return Trailhead.findByIds(locations);
    } else return [];
  }

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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteTripRequest(
    @Arg('id') id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const tr = await TripRequest.findOne({ where: { id } });
    if (!tr || tr.userId !== req.session?.userId) {
      throw Error('Could not find trip record.');
    }
    try {
      await TripRequest.delete({ id });
      return true;
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async editTripRequest(
    @Arg('input') input: EditTripRequestInput,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    let tr = (await TripRequest.findOne({ where: { id: input.id } })) as any;
    if (!tr || tr.userId !== req.session?.userId) {
      throw Error('Could not find trip record.');
    }
    tr = {
      ...tr,
      ...input,
    };
    try {
      await TripRequest.save(tr);
      return true;
    } catch (e) {
      throw Error();
    }
  }
}