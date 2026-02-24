import { GreetingRepository } from '../repositories/greeting.repository';
import { IBaseUseCase } from './base.interface';

export class SayHelloUseCase
  implements IBaseUseCase<string, { message: string }>
{
  constructor(private readonly greetingRepository: GreetingRepository) {}

  execute = async (name: string): Promise<{ message: string }> => {
    return this.greetingRepository.SayHello(name);
  };
}
