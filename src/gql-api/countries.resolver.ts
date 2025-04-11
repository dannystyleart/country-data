import { Args, Query, Resolver } from '@nestjs/graphql';
import { CountriesService } from '../country/countries.service';
import { Country, CountryNeighours } from './models/country.model';

@Resolver(() => Country)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Query(() => Country, { description: 'Find country by name' })
  async findCountry(
    @Args('search', { type: () => String })
    search: string,
  ) {
    const foundCountries = await this.countriesService.findCountry(search);
    if (!foundCountries.length) {
      throw new Error(`Country not found`);
    }

    return foundCountries[0];
  }

  @Query(() => [Country], { description: 'List of countries' })
  allCountry() {
    return this.countriesService.getCountries();
  }

  @Query(() => CountryNeighours, {
    description: 'Get neighbouring countries of a country',
  })
  async getCountryNeighbours(
    @Args('country', { type: () => String, description: 'Country name' })
    search: string,
  ) {
    const foundCountries = await this.countriesService.findCountry(search);
    if (!foundCountries.length) {
      throw new Error(`Country not found`);
    }

    return this.countriesService.getCountryNeighbours(search);
  }
}
