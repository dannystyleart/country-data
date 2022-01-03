import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CountriesService } from './countries.service';
import {
  CountryListProviderToken,
  LandborderListProviderToken,
} from './dataset/constants';
import countries from './dataset/countries';
import landBorders from './dataset/landborders';

@Module({
  imports: [],
  controllers: [AppController],
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
})
export class AppModule { }
