import { Observable } from 'rxjs';
import { CreatePokemonDto } from '@/core/use-cases/dto/create-pokemon.dto';
import { UpdatePokemonDto } from '@/core/use-cases/dto/update-pokemon.dto';
import { PokemonResponseDto } from '@/core/use-cases/dto/get-pokemon.dto';
import { ListPokemonsFiltersDto } from '@/core/use-cases/dto/list-pokemons.dto';

export interface PokemonGrpcService {
  createPokemon(data: CreatePokemonDto): Observable<{ id: string }>;
  updatePokemon(data: UpdatePokemonDto): Observable<void>;
  getPokemon(data: { id: string }): Observable<PokemonResponseDto>;
  listPokemons(data: ListPokemonsFiltersDto): Observable<{ pokemons: PokemonResponseDto[] }>;
}
