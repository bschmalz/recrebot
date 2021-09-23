import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  email: string;
  @Field({ nullable: true })
  phone: string;
  @Field()
  password: string;
}
