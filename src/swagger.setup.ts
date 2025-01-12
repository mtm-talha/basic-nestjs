import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * sets up Swagger documentation
 * @param {INestApplication} application
 */
export function configureSwagger(
  application: INestApplication,
): INestApplication {
  const options = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'NestJS App')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION || 'Restful APIs for NestJS App',
    )
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .build();

  const document = SwaggerModule.createDocument(application, options);

  SwaggerModule.setup('api-swagger', application, document);

  return application;
}
