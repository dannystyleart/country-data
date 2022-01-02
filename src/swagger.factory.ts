import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const createSwaggerDocument = (
  app: INestApplication,
  options: any = {},
) => {
  const config = new DocumentBuilder()
    .setTitle(options?.title)
    .setVersion('1.0')
    .build();

  return SwaggerModule.createDocument(app, config);
};
