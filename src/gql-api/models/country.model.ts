import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Country' })
export class Country {
  @Field()
  name: string;

  @Field()
  iso2: string;

  @Field()
  iso3: string;
}
