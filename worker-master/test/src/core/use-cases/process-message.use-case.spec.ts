import { TestBed } from '@automock/jest';
import { Logger } from '@nestjs/common';

import { Message } from '@/core/entities/message';
import { ProcessMessageUseCase } from '@/core/use-cases/process-message.use-case';

describe(ProcessMessageUseCase.name, () => {
  let useCase: ProcessMessageUseCase;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const { unit } = TestBed.create(ProcessMessageUseCase).compile();
    useCase = unit;

    loggerSpy = jest.spyOn(Logger.prototype, 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should process message and log appropriate messages', async () => {
    const message: Message = {
      id: '123',
      message: 'Test message',
    };

    await useCase.execute(message);

    expect(loggerSpy).toHaveBeenCalledTimes(2);
    expect(loggerSpy).toHaveBeenNthCalledWith(1, 'Processing message id: 123.');
    expect(loggerSpy).toHaveBeenNthCalledWith(
      2,
      'Message with content "Test message" has been processed.',
    );
  });
});
