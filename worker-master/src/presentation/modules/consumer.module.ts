import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';

import * as useCases from '@/core/use-cases';

import { ProcessMessageConsumer } from '../sqs/consumers/process-messages.consumer';
import { ProducerModule } from './producer.module';
import type { InjectableClassType } from './decorators/injectable-class.decorator';

@Module({
  imports: [
    ProducerModule,
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
