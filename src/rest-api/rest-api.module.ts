import { Module } from '@nestjs/common';
import { CountryModule } from '../country/country.module';
import { RestApiController } from './rest-api.controller';

@Module({
  imports: [CountryModule, RestApiModule],
  controllers: [RestApiController],
})
export class RestApiModule {}
