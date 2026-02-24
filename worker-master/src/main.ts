import 'dotenv/config';
import 'newrelic';

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';

import { AppModule } from './presentation/modules/app.module';

const { PORT = 3000, BIND_ADDRESS = '0.0.0.0' } = process.env;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  app.useLogger(app.get(Logger));

  await app.listen(PORT, BIND_ADDRESS);
}
bootstrap();
