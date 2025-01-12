import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { configureSwagger } from './swagger.setup';
import { configureMiddleware } from './middleware.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const log = new Logger(`Bootstrap`);
  const PORT = process.env.PORT ?? 3000;
  const ENV = process.env.NODE_ENV ?? 'development';
  log.log(`Starting Application in ${ENV} mode on port ${PORT}`);

  configureMiddleware(app);
  configureSwagger(app);
  await app.listen(Number(PORT));
}
bootstrap();
