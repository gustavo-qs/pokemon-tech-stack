import { Module } from '@nestjs/common';
import { HealthModule } from './health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SayHelloUseCase } from '@/core/use-cases/say-hello.use-case';
import { CreatePokemonUseCase } from '@/core/use-cases/create-pokemon.use-case';
import { UpdatePokemonUseCase } from '@/core/use-cases/update-pokemon.use-case';
import { GetPokemonUseCase } from '@/core/use-cases/get-pokemon.use-case';
import { ListPokemonsUseCase } from '@/core/use-cases/list-pokemons.use-case';
import { makeInjectable } from './helpers/make-injectable';
import { GreeterController } from '../http/controllers/greeter.controller';
import { PokemonController } from '../http/controllers/pokemon.controller';
import { LoggerModule } from 'nestjs-pino';
import { GRPCGreetingRepository } from '@/infrastructure/grpc/greeting.repository';
import { GreetingRepository } from '@/core/repositories/greeting.repository';
import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { GRPCPokemonRepository } from '@/infrastructure/grpc/pokemon.repository';
import { pinoConfig } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: pinoConfig,
    }),
    HealthModule,
  ],
  controllers: [GreeterController, PokemonController],
  providers: [
    {
      provide: GreetingRepository,
      useClass: GRPCGreetingRepository,
    },
    makeInjectable(SayHelloUseCase, [GreetingRepository]),
    {
      provide: PokemonRepository,
      useClass: GRPCPokemonRepository,
    },
    makeInjectable(CreatePokemonUseCase, [PokemonRepository]),
    makeInjectable(UpdatePokemonUseCase, [PokemonRepository]),
    makeInjectable(GetPokemonUseCase, [PokemonRepository]),
    makeInjectable(ListPokemonsUseCase, [PokemonRepository]),
  ],
})
export class AppModule {}
