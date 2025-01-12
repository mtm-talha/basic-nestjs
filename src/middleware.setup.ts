import { INestApplication } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

/**
 * sets up multiple middleware
 * @param {INestApplication} app
 */
export function configureMiddleware(app: INestApplication): INestApplication {
  app.setGlobalPrefix('/api/v1', {
    exclude: ['health-check', 'throttle-check'],
  });
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  return app;
}
