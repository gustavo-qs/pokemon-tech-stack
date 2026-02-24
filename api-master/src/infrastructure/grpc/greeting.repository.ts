import { GreetingRepository } from '@/core/repositories/greeting.repository';
import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GreeterService } from './services/greeting.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GRPCGreetingRepository implements GreetingRepository {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.SUPPORT_DATASERVER_IP,
      package: 'helloworld',
      protoPath: join(__dirname, '/protos/helloworld.proto'),
    },
  })
  client: ClientGrpc;

  SayHello(name: string) {
    return lastValueFrom(
      this.client.getService<GreeterService>('Greeter').sayHello({ name }),
    );
  }
}
