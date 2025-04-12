import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import {
  CountryListProviderToken,
  LandborderListProviderToken,
} from './dataset/constants';
import countries from './dataset/countries';
import landBorders from './dataset/landborders';

@Module({
  providers: [
    CountriesService,
    {
      provide: CountryListProviderToken,
      useValue: countries,
    },
    {
      provide: LandborderListProviderToken,
      useValue: landBorders,
    },
  ],
  exports: [CountriesService],
})
export class CountryModule {}
