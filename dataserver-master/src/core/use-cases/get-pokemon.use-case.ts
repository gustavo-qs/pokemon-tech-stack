import { PokemonData } from '../entities/pokemon';
import { IPokemonRepository } from '../repositories/pokemon.repository';
import { IBaseUseCase } from './base';

export type IGetPokemonUseCase = IBaseUseCase<{ id: string }, PokemonData>;

export class GetPokemonUseCase implements IGetPokemonUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute = async ({ id }: { id: string }): Promise<PokemonData> => {
    return this.pokemonRepository.findById(id);
  };
}
