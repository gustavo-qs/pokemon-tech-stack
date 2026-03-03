import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';

import * as useCases from '@/core/use-cases';

import { ProcessMessageConsumer } from '../sqs/consumers/process-messages.consumer';
import { PokemonGrpcModule } from '@/infrastructure/grpc/pokemon.grpc.module';
import type { InjectableClassType } from './decorators/injectable-class.decorator';

@Module({
  imports: [
    PokemonGrpcModule,
    SqsModule.register({
      consumers: [
        {
          name: process.env.PROCESS_MESSAGE_QUEUE_NAME,
          queueUrl: process.env.PROCESS_MESSAGE_QUEUE_URL,
          region: process.env.AWS_REGION,
        },
      ],
      producers: [],
    }),
  ],
  controllers: [],
  providers: [
    ...Object.values(useCases).flatMap(
      (useCase) => (useCase as InjectableClassType<typeof useCase>).asProvider,
    ),
    ProcessMessageConsumer,
  ],
})
export class ConsumerModule {}
