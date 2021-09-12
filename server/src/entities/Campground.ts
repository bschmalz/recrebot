import { ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';
import { Reservable } from './Reservable';

@ObjectType()
@Entity()
export class Campground extends Reservable {}
