import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesService } from './countries.service';
import countries from './dataset/countries';
import landBorders from './dataset/landborders';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CountriesService,
    {
      provide: 'COUNTRY_LIST',
      useValue: countries,
    },
    {
      provide: 'LANDBORDER_LIST',
      useValue: landBorders,
    },

  ],
})
export class AppModule { }
