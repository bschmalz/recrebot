import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservable } from './Reservable';

@ObjectType()
@Entity()
export class TripRequest extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId: number;

  @Field()
  @Column('boolean', { default: true })
  active: boolean;

  @Field()
  @Column({ nullable: true })
  custom_name: string;

  @Field()
  @Column()
  type: string;

  @Field(() => [String])
  @Column('varchar', { array: true })
  dates: string[];

  @Field(() => [Reservable])
  @Column('int', { array: true })
  locations: number[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  min_nights: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  num_hikers: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  last_success: Date;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
