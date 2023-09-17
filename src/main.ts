import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createSwaggerDocument } from './swagger.factory';

async function bootstrap() {
  const corsWhitelist = (process.env.CORS_WHITELIST || '')
    .split('|')
    .filter(Boolean);
  const app = await NestFactory.create(AppModule, {
    cors: corsWhitelist.length > 0 && {
      origin: corsWhitelist,
    },
  });
  console.log(corsWhitelist);
  const port = process.env.PORT || 3000;
  const swaggerTitle = 'Country Neighbours API';

  SwaggerModule.setup(
    '',
    app,
    createSwaggerDocument(app, { title: swaggerTitle }),
    {
      customSiteTitle: swaggerTitle,
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}

bootstrap();
