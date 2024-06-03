import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import * as UserAgent from 'express-useragent';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors();
  app.use(helmet());
  app.use(UserAgent.express());
  if (
    config.get('NODE_ENV') === 'development' ||
    config.get('NODE_ENV') === 'test'
  ) {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net/'],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://cdn.jsdelivr.net/',
          ],
        },
      }),
    );
  }
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.disable('x-powered-by');

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
