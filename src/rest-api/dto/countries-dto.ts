import { ApiProperty } from '@nestjs/swagger';
import { CountryDto } from './country-dto';

export class CountrySearchPathParamDto {
  @ApiProperty({
    type: 'string',
    description: 'Country name or iso2 (2 letters) or iso3 (3 letters)',
    default: 'HUN',
  })
  country: string;
}

export class CountryNeighboursDto {
  @ApiProperty({
    type: CountryDto,
  })
  country: CountryDto;

  @ApiProperty({
    type: [CountryDto],
  })
  neighbours: Array<CountryDto>;
}
