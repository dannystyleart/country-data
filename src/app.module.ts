import { Module } from '@nestjs/common';
import { RestApiModule } from './rest-api/rest-api.module';
import { GqlApiModule } from './gql-api/gql-api.module';

@Module({
  imports: [RestApiModule, GqlApiModule],
})
export class AppModule {}
