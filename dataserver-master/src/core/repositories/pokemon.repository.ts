import { Pokemon, PokemonData } from '../entities/pokemon';

export type FindAllFilters = {
  abilities?: string[];
  hasMoreEvolution?: boolean;
};

export interface IPokemonRepository {
  create(pokemon: Pokemon): Promise<{ id: string }>;
  update(id: string, pokemon: Pokemon): Promise<void>;
  findById(id: string): Promise<PokemonData>;
  findAll(filters: FindAllFilters): Promise<PokemonData[]>;
}
