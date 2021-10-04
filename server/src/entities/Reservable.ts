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
export abstract class Reservable extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar')
  legacy_id: string;

  @Field()
  @Index({ fulltext: true })
  @Column('varchar')
  parent_name: string;

  @Field({ nullable: true })
  @Column('varchar', { nullable: true })
  parent_id: string;

  @Field({ nullable: true })
  @Index({ fulltext: true })
  @Column('varchar', { nullable: true })
  subparent_name: string;

  @Field({ nullable: true })
  @Column('varchar', { nullable: true })
  subparent_id: string;

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
  type: string;

  @Field()
  @Column('varchar')
  sub_type: string;
}
