import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GreeterInput, GreeterResponse } from './dtos/greeter.dto';
import { ISayHelloUseCase } from '@/core/use-cases/say-hello.use-case';

@Controller()
export class GreeterController {
  constructor(
    @Inject('ISayHelloUseCase') private readonly useCase: ISayHelloUseCase,
  ) {}

  @GrpcMethod('Greeter', 'SayHello')
  async check({ name }: GreeterInput): Promise<GreeterResponse> {
    return {
      message: await this.useCase.execute(name),
    };
  }
}
