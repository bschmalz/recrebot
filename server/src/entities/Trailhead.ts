import { ObjectType, Field } from 'type-graphql';
import { Entity, Column, Index } from 'typeorm';
import { Reservable } from './Reservable';

@ObjectType()
@Entity()
export class Trailhead extends Reservable {
  @Field()
  @Index({ fulltext: true })
  @Column('varchar')
  district: string;

  @Field()
  @Column('varchar')
  facility_id: string;

  @Field()
  @Column('varchar')
  facility_name: string;
}
