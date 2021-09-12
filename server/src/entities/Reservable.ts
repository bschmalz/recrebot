import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@ObjectType()
@Entity()
export class Reservable extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar')
  legacy_id: string;

  @Field()
  @Index({ fulltext: true })
  @Column('varchar')
  recarea_name: string;

  @Field()
  @Index({ fulltext: true })
  @Column('varchar')
  name: string;

  @Field()
  @Column('double precision')
  latitude: number;

  @Field()
  @Column('double precision')
  longitude: number;

  @Field()
  @Column('varchar')
  source: string;

  @Field()
  @Column('varchar')
  description: string;
}
