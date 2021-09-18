import { ObjectType, Field } from 'type-graphql';
import { Entity, Column, Index } from 'typeorm';
import { Reservable } from './Reservable';

@ObjectType()
@Entity()
export class Trailhead extends Reservable {}
