import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupSwagger(app);
  await app.listen(3000);
}

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(`Nest Based application`)
    .setVersion(`1.0`)
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  try {
    const outputSwaggerFile = `${process.cwd()}/output-specs/nest-based.json`;
    fs.writeFileSync(outputSwaggerFile, JSON.stringify(document, null, 2), { encoding: 'utf-8' });
  } catch (e) {
    console.warn(`Could not save swagger docs into file`, e);
  }
  SwaggerModule.setup('/docs', app, document, { customSiteTitle: `Nest based` });
}
bootstrap();
