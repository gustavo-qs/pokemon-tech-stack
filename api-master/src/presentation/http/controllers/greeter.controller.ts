import { Body, Controller, Post } from '@nestjs/common';

import { SayHelloUseCase } from '@/core/use-cases/say-hello.use-case';

@Controller('greeting')
export class GreeterController {
  constructor(private readonly useCase: SayHelloUseCase) {}

  @Post('hello')
  sayHello(@Body() { name }: { name: string }) {
    return this.useCase.execute(name);
  }
}
