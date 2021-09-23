import { InputType, Field } from 'type-graphql';

@InputType()
export class EmailInput {
  @Field()
  email: string;
}
