export type UpdatePokemonDto = {
  id: string;
  basicForm: string;
  ability: string;
  middleFormEvolutionLevel?: number;
  middleForm?: string;
  finalFormEvolutionLevel?: number;
  finalForm?: string;
};
