import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Country } from './dataset/countries';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('COUNTRY_LIST')
    private readonly countryList: any,

    @Inject('LANDBORDER_LIST')
    private readonly landbordersList: any
  ) { }

  getCountries(): Array<Country> {
    return this.countryList;
  }

  findCountry(search: string) {
    let searchConfig: { field: keyof Country, term: RegExp | string } = {
      field: 'name',
      term: new RegExp(search, 'ig'),
    };

    switch (search.length) {
      case 3:
        searchConfig.field = 'iso3';
        searchConfig.term = search.toUpperCase();
        break;
      case 2:
        searchConfig.field = 'iso2';
        searchConfig.term = search.toUpperCase();
        break;
      case 0:
        throw new BadRequestException('INVALID SEARCH TERM');
    }


    const result = this.countryList.find((country) => {
      const identifierValue = country[searchConfig.field]
      if (searchConfig.field === 'name') return (searchConfig.term as RegExp).test(identifierValue)
      return identifierValue === searchConfig.term;
    });

    if (!result) throw new NotFoundException(`Could not found country matching for: ${search}`)

    return result;
  }

  getCountryNeighbours(search: string) {
    const country = this.findCountry(search);
    const neighbours = this.landbordersList[country.iso3].map(this.findCountry.bind(this));
    return {
      country,
      neighbours
    }
  }
}
