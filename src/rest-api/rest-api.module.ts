import { Module } from '@nestjs/common';
import { CountryModule } from 'src/country/country.module';
import { AppController } from './app.controller';

@Module({
  imports: [CountryModule, RestApiModule],
  controllers: [AppController],
})
export class RestApiModule {}
