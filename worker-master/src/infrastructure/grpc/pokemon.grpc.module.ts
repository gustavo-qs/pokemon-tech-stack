import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  PokemonGrpcClientService,
  POKEMON_GRPC_CLIENT,
} from './pokemon.grpc.client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: POKEMON_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          url: process.env.DATASERVER_IP ?? 'localhost:50051',
          package: 'pokemon',
          protoPath: join(__dirname, 'protos/pokemon.proto'),
        },
      },
    ]),
  ],
  providers: [PokemonGrpcClientService],
  exports: [PokemonGrpcClientService],
})
export class PokemonGrpcModule {}
