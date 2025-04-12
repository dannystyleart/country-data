import { Field, ObjectType } from '@nestjs/graphql';
import { Country } from './country.model';

@ObjectType({ description: 'Country neighbors' })
export class CountryNeighours {
  @Field(() => Country)
  country: Country;

  @Field(() => [Country])
  neighbours: Country[];
}
