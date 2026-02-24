import { Module } from '@nestjs/common';
import { HealthModule } from './health.module';
import { ConfigModule } from '@nestjs/config';
import { GreeterController } from '@/presentation/grpc/controllers/greeter.controller';
import { PokemonGrpcController } from '@/presentation/grpc/controllers/pokemon.controller';
import { SayHelloUseCase } from '@/core/use-cases/say-hello.use-case';
import { CreatePokemonUseCase } from '@/core/use-cases/create-pokemon.use-case';
import { UpdatePokemonUseCase } from '@/core/use-cases/update-pokemon.use-case';
import { GetPokemonUseCase } from '@/core/use-cases/get-pokemon.use-case';
import { ListPokemonsUseCase } from '@/core/use-cases/list-pokemons.use-case';
import { makeInjectable } from './helpers/make-injectable';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoosePokemonRepository } from '@/infrastructure/orm/mongoose/pokemon.repository';
import { PokemonSchemaClass, PokemonSchema } from '@/infrastructure/orm/mongoose/schemas/pokemon.schema';

const { NODE_ENV, LOGLEVEL } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV ?? '');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'DATASERVER BOILERPLATE',
        level: LOGLEVEL ?? 'info',
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            },
      },
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: PokemonSchemaClass.name, schema: PokemonSchema },
    ]),
    HealthModule,
  ],
  controllers: [GreeterController, PokemonGrpcController],
  providers: [
    makeInjectable('ISayHelloUseCase', SayHelloUseCase),
    { provide: 'IPokemonRepository', useClass: MongoosePokemonRepository },
    makeInjectable('ICreatePokemonUseCase', CreatePokemonUseCase, [
      'IPokemonRepository',
    ]),
    makeInjectable('IUpdatePokemonUseCase', UpdatePokemonUseCase, [
      'IPokemonRepository',
    ]),
    makeInjectable('IGetPokemonUseCase', GetPokemonUseCase, [
      'IPokemonRepository',
    ]),
    makeInjectable('IListPokemonsUseCase', ListPokemonsUseCase, [
      'IPokemonRepository',
    ]),
  ],
})
export class AppModule {}
