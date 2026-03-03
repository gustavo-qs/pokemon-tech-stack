import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';

import type { PokemonLevelUpdate } from '@/core/entities/pokemon-level-update';
import { ProcessPokemonLevelUpdateUseCase } from '@/core/use-cases';

@Injectable()
export class ProcessMessageConsumer {
  constructor(
    private readonly processUseCase: ProcessPokemonLevelUpdateUseCase,
  ) {}
  private readonly logger = new Logger(ProcessMessageConsumer.name);

  @SqsMessageHandler(
    /** name: */ process.env.PROCESS_MESSAGE_QUEUE_NAME,
    /** batch: */ false,
  )
  public async handleMessage(message: Message) {
    const parsedMessage = <PokemonLevelUpdate>JSON.parse(message.Body);

    await this.processUseCase.execute(parsedMessage);
  }

  @SqsConsumerEventHandler(
    /** name: */ process.env.PROCESS_MESSAGE_QUEUE_NAME,
    /** eventName: */ 'processing_error',
  )
  public onProcessingError(error: Error, message: Message) {
    this.logger.error(`Error processing message: ${message.MessageId}`);
  }
}
