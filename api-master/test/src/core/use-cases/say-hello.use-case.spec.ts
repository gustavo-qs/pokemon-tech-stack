import { IGreetingRepository } from '@/core/repositories/greeting.repository';
import {
  ISayHelloUseCase,
  SayHelloUseCase,
} from '@/core/use-cases/say-hello.use-case';
import { TestBed } from '@automock/jest';
import { Inject } from '@nestjs/common';

class SayHelloUseCaseMockedConstructor extends SayHelloUseCase {
  constructor(
    @Inject('IGreetingRepository')
    greetingRepository: IGreetingRepository,
  ) {
    super(greetingRepository);
  }
}

describe(SayHelloUseCase.name, () => {
  let useCase: ISayHelloUseCase;
  let repo: jest.Mocked<IGreetingRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      SayHelloUseCaseMockedConstructor,
    ).compile();

    useCase = unit;
    repo = unitRef.get('IGreetingRepository');
  });

  test('should return a message to given name', async () => {
    repo.SayHello.mockImplementationOnce(() =>
      Promise.resolve({ message: 'Hello, Jon Doe' }),
    );
    const name = 'Jon Doe';
    const result = await useCase.execute(name);

    expect(result).toStrictEqual({ message: 'Hello, Jon Doe' });
  });
});
