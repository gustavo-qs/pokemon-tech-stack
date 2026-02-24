export type CreatePokemonRequest = {
  basicForm: string;
  ability: string;
  middleFormEvolutionLevel?: number;
  middleForm?: string;
  finalFormEvolutionLevel?: number;
  finalForm?: string;
};

export type CreatePokemonResponse = {
  id: string;
};

export type UpdatePokemonRequest = {
  id: string;
  basicForm: string;
  ability: string;
  middleFormEvolutionLevel?: number;
  middleForm?: string;
  finalFormEvolutionLevel?: number;
  finalForm?: string;
};

export type GetPokemonRequest = {
  id: string;
};

export type PokemonResponse = {
  id: string;
  name: string;
  level: number;
  basicForm: string;
  ability: string;
  hasMoreEvolution: boolean;
  middleFormEvolutionLevel?: number;
  middleForm?: string;
  finalFormEvolutionLevel?: number;
  finalForm?: string;
};

export type ListPokemonsRequest = {
  abilities?: string[];
  hasMoreEvolution?: boolean;
};

export type ListPokemonsResponse = {
  pokemons: PokemonResponse[];
};
