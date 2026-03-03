import { Logger } from '@nestjs/common';

import { InjectableClass } from '@/presentation/modules/decorators/injectable-class.decorator';
import { PokemonGrpcClientService } from '@/infrastructure/grpc/pokemon.grpc.client.service';

import { PokemonLevelUpdate } from '../entities/pokemon-level-update';
import { IBaseUseCase } from './base.interface';

@InjectableClass()
export class ProcessPokemonLevelUpdateUseCase
  implements IBaseUseCase<PokemonLevelUpdate, void>
{
  private readonly logger = new Logger(ProcessPokemonLevelUpdateUseCase.name);

  constructor(private readonly pokemonGrpcClient: PokemonGrpcClientService) {}

  execute = async ({ id, pokemonId }: PokemonLevelUpdate): Promise<void> => {
    this.logger.log(
      `Processing level update message id: ${id} for pokemon: ${pokemonId}`,
    );

    const pokemon = await this.pokemonGrpcClient.getPokemon(pokemonId);

    const reachedFinalForm =
      pokemon.finalForm &&
      pokemon.finalFormEvolutionLevel !== undefined &&
      pokemon.level >= pokemon.finalFormEvolutionLevel;

    if (reachedFinalForm) {
      await this.pokemonGrpcClient.markNoMoreEvolution(pokemonId);
      this.logger.log(
        `Pokemon ${pokemonId} reached final form. Marked as no more evolution.`,
      );
    } else {
      this.logger.log(
        `Pokemon ${pokemonId} has not reached final form yet. No action taken.`,
      );
    }
  };
}
