import { Injectable, Logger } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { v4 } from 'uuid';

@Injectable()
export class MessageProcessedProducerService {
  constructor(private readonly sqsService: SqsService) {}

  private readonly logger = new Logger(MessageProcessedProducerService.name);

  async sendMessage(messageId: string) {
    try {
      await this.sqsService.send(process.env.MESSAGE_PROCESSED_QUEUE_NAME, {
        id: v4(),
        body: JSON.stringify({
          messageId,
          status: 'PROCESSED',
        }),
      });

      this.logger.log(
        `Status PROCESSED for message id ${messageId} has been sent.`,
      );
    } catch (error) {
      this.logger.error('error in producing message for report queue', error);
    }
  }
}
