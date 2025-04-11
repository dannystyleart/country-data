import { Module } from '@nestjs/common';
import { RestApiModule } from './rest-api/rest-api.module';

@Module({
  imports: [RestApiModule],
})
export class AppModule {}
