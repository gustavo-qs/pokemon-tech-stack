import { PokemonRepository } from '../repositories/pokemon.repository';
import { PokemonResponseDto } from './dto/get-pokemon.dto';
import { ListPokemonsFiltersDto } from './dto/list-pokemons.dto';
import { IBaseUseCase } from './base.interface';

export class ListPokemonsUseCase implements IBaseUseCase<ListPokemonsFiltersDto, PokemonResponseDto[]> {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute = async (filters: ListPokemonsFiltersDto): Promise<PokemonResponseDto[]> => {
    return this.pokemonRepository.findAll(filters);
  };
}
