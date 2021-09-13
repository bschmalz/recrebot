import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class TripRequest extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @PrimaryColumn()
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

  @Field(() => [Date])
  @Column('date', { array: true })
  dates: Date[];

  @Field(() => [Int])
  @Column('int', { array: true })
  locations: number[];

  @Field()
  @Column({ nullable: true })
  min_nights: number;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
