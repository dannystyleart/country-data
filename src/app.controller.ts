import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import {
  CountryNeighboursDto,
  CountrySearchPathParamDto,
} from './dto/countries-dto';
import { CountryDto } from './dto/country-dto';

@Controller('api')
export class AppController {
  constructor(private readonly countryService: CountriesService) {}

  @Get('/countries')
  @ApiOperation({
    summary: 'List countries',
    description: 'Retrieve all countries from the collection',
  })
  @ApiResponse({
    status: 200,
    type: CountryDto,
    isArray: true,
  })
  listCountries() {
    return this.countryService.getCountries();
  }

  @Get('/countries/:country')
  @ApiOperation({
    summary: 'Filter countries',
    description: 'Find countries within the collection',
  })
  @ApiResponse({
    status: 200,
    type: CountryDto,
    isArray: true,
  })
  findCountry(@Param() params: CountrySearchPathParamDto) {
    const { country } = params;
    return this.countryService.findCountry(country.trim());
  }

  @Get('/countries/:country/neighbours')
  @ApiOperation({
    summary: 'Get neighbours',
    description: 'Find countries and their within the collection',
  })
  @ApiResponse({
    status: 200,
    type: CountryNeighboursDto,
  })
  findCountryNeighbours(@Param() params: CountrySearchPathParamDto) {
    const { country } = params;
    return this.countryService.getCountryNeighbours(country.trim());
  }
}
