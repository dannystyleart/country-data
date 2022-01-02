import { ApiResponseProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiResponseProperty({ type: 'string' })
  name: string;

  @ApiResponseProperty({ type: 'string' })
  iso2: string;

  @ApiResponseProperty({ type: 'string' })
  iso3: string;
}
