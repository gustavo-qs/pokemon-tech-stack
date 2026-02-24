import { Logger } from '@nestjs/common';

import { InjectableClass } from '@/presentation/modules/decorators/injectable-class.decorator';

import { Message } from '../entities/message';
import { IBaseUseCase } from './base.interface';

export type Messgae = { id: string; message: string };

@InjectableClass()
export class ProcessMessageUseCase implements IBaseUseCase<Message, void> {
  private readonly logger = new Logger(ProcessMessageUseCase.name);

  execute = async ({ id, message }: Message) => {
    this.logger.log(`Processing message id: ${id}.`);

    // Do something with the message

    this.logger.log(`Message with content "${message}" has been processed.`);
  };
}
