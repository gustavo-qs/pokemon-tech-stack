import { InvalidArgumentException } from '@/core/exceptions/invalid-argument.exception';
import {
  ISayHelloUseCase,
  SayHelloUseCase,
} from '@/core/use-cases/say-hello.use-case';
import { TestBed } from '@automock/jest';

describe(SayHelloUseCase.name, () => {
  let useCase: ISayHelloUseCase;

  beforeEach(async () => {
    const { unit } = TestBed.create(SayHelloUseCase).compile();

    useCase = unit;
  });

  test('should return a message to given name', async () => {
    const name = 'Jon Doe';
    const result = await useCase.execute(name);

    expect(result).toStrictEqual('Hello, Jon Doe');
  });

  test('should throw without name', async () => {
    const name = undefined;

    await expect(useCase.execute(name)).rejects.toThrow(
      InvalidArgumentException,
    );
  });
});
