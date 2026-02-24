import { PokemonData } from '../entities/pokemon';
import { FindAllFilters, IPokemonRepository } from '../repositories/pokemon.repository';
import { IBaseUseCase } from './base';

export type IListPokemonsUseCase = IBaseUseCase<FindAllFilters, PokemonData[]>;

export class ListPokemonsUseCase implements IListPokemonsUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute = async (filters: FindAllFilters): Promise<PokemonData[]> => {
    return this.pokemonRepository.findAll(filters);
  };
}
