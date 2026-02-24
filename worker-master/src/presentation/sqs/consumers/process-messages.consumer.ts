import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';

import type { Message as MessageEntity } from '@/core/entities/message';
import { ProcessMessageUseCase } from '@/core/use-cases';

import { MessageProcessedProducerService } from '../producers/message-processed.producer';

@Injectable()
export class ProcessMessageConsumer {
  constructor(
    private readonly processMessageUseCase: ProcessMessageUseCase,
    private readonly messageProcessedProducer: MessageProcessedProducerService,
  ) {}
  private readonly logger = new Logger(ProcessMessageConsumer.name);

  @SqsMessageHandler(
    /** name: */ process.env.PROCESS_MESSAGE_QUEUE_NAME,
    /** batch: */ false,
  )
  public async handleMessage(message: Message) {
    const parsedMessage = <MessageEntity>JSON.parse(message.Body);

    await this.processMessageUseCase.execute(parsedMessage);

    await this.messageProcessedProducer.sendMessage(parsedMessage.id);
  }

  @SqsConsumerEventHandler(
    /** name: */ process.env.PROCESS_MESSAGE_QUEUE_NAME,
    /** eventName: */ 'processing_error',
  )
  public onProcessingError(error: Error, message: Message) {
    // In case of error, decide whether to retry or not

    this.logger.error(`Error processing message: ${message.MessageId}`);
  }
}
