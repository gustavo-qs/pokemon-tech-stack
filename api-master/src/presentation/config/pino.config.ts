import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export const pinoConfig = (configService: ConfigService): Params => {
  const NODE_ENV = configService.get('NODE_ENV');
  const LOGLEVEL = configService.get('LOGLEVEL');
  const appName = configService.get('APP_NAME');
  const isProduction = ['prod', 'production'].includes(NODE_ENV ?? '');

  return {
    pinoHttp: {
      base: { environment: NODE_ENV },
      name: appName,
      level: isProduction ? (LOGLEVEL ?? 'info') : 'trace',
      transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          },
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    },
    exclude: [{ method: RequestMethod.ALL, path: 'healthcheck' }],
  };
};
