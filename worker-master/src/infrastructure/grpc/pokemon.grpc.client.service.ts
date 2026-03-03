import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PokemonGrpcService, PokemonResponse } from './pokemon.grpc.service';

export const POKEMON_GRPC_CLIENT = 'POKEMON_GRPC_CLIENT';

@Injectable()
export class PokemonGrpcClientService implements OnModuleInit {
  private readonly logger = new Logger(PokemonGrpcClientService.name);
  private pokemonService: PokemonGrpcService;

  constructor(
    @Inject(POKEMON_GRPC_CLIENT) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.pokemonService =
      this.client.getService<PokemonGrpcService>('PokemonService');
  }

  async getPokemon(id: string): Promise<PokemonResponse> {
    return lastValueFrom(this.pokemonService.getPokemon({ id }));
  }

  async markNoMoreEvolution(id: string): Promise<void> {
    await lastValueFrom(this.pokemonService.markNoMoreEvolution({ id }));
    this.logger.log(`Marked pokemon ${id} as having no more evolution.`);
  }
}
