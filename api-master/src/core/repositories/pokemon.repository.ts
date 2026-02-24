import { CreatePokemonDto } from '@/core/use-cases/dto/create-pokemon.dto';
import { UpdatePokemonDto } from '@/core/use-cases/dto/update-pokemon.dto';
import { PokemonResponseDto } from '@/core/use-cases/dto/get-pokemon.dto';
import { ListPokemonsFiltersDto } from '@/core/use-cases/dto/list-pokemons.dto';

export abstract class PokemonRepository {
  abstract create(data: CreatePokemonDto): Promise<{ id: string }>;
  abstract update(data: UpdatePokemonDto): Promise<void>;
  abstract findById(id: string): Promise<PokemonResponseDto>;
  abstract findAll(filters: ListPokemonsFiltersDto): Promise<PokemonResponseDto[]>;
}
