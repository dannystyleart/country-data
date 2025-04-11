import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CountryListProviderToken,
  LandborderListProviderToken,
} from './dataset/constants';
import { CountryNeighboursDto } from '../rest-api/dto/countries-dto';
import { CountryDto } from '../rest-api/dto/country-dto';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(CountryListProviderToken)
    private readonly countryList: Array<CountryDto>,

    @Inject(LandborderListProviderToken)
    private readonly landbordersList: { [key: string]: Array<string> },
  ) {}

  getCountries(): Array<CountryDto> {
    return this.countryList;
  }

  findCountry(search: string): Array<CountryDto> {
    const searchConfig: { field: keyof CountryDto; term: RegExp | string } = {
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

    const result = this.countryList.filter((country) => {
      const identifierValue = country[searchConfig.field];
      if (searchConfig.field === 'name')
        return (searchConfig.term as RegExp).test(identifierValue);
      return identifierValue === searchConfig.term;
    });

    if (!result.length)
      throw new NotFoundException(`Could not find country for: ${search}`);

    return result;
  }

  getCountryNeighbours(search: string): CountryNeighboursDto {
    const [country] = this.findCountry(search);
    const neighbours = this.landbordersList[country.iso3].map((iso3) => {
      const [countryByIso3] = this.findCountry(iso3);
      return countryByIso3;
    });
    return {
      country,
      neighbours,
    };
  }
}
