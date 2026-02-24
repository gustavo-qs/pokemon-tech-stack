import { Greeting } from '../entities/greeting';
import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';
import { IBaseUseCase } from './base';

export type ISayHelloUseCase = IBaseUseCase<string, string>;

export class SayHelloUseCase implements ISayHelloUseCase {
  execute = async (name: string): Promise<string> => {
    if (!name) throw new InvalidArgumentException('prop name is required.');

    return new Greeting(name).say;
  };
}
