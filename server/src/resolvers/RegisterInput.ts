import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field({ nullable: true })
  phone: string;
  @Field()
  password: string;
  @Field()
  email: string;
}
