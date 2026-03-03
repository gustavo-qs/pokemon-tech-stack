import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { pinoConfig } from '../config';
import { ConsumerModule } from './consumer.module';
import { HealthModule } from './health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.development'] }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: pinoConfig,
    }),
    HealthModule,
    ConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
