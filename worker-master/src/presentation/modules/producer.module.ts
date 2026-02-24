import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';

import { MessageProcessedProducerService } from '../sqs/producers/message-processed.producer';

@Module({
  imports: [
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: process.env.MESSAGE_PROCESSED_QUEUE_NAME,
          queueUrl: process.env.MESSAGE_PROCESSED_QUEUE_URL,
          region: process.env.AWS_REGION,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [MessageProcessedProducerService],
  exports: [MessageProcessedProducerService],
})
export class ProducerModule {}
