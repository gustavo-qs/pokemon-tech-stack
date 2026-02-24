export type PokemonResponseDto = {
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
