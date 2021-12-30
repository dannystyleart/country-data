import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller()
export class AppController {
  constructor(private readonly countryService: CountriesService) { }

  @Get('/countries')
  listCountries(@Query('search') search: string = '') {
    if (search.trim().length > 0)
      return this.countryService.findCountry(search.trim());

    return this.countryService.getCountries();
  }

  @Get('/countries/:country')
  findCountry(@Param('country') country: string = '') {
    return this.countryService.findCountry(country.trim());
  }

  @Get('/countries/:country/neigbours')
  findCountryNeighbours(@Param('country') country: string = '') {
    return this.countryService.getCountryNeighbours(country.trim());
  }
}
