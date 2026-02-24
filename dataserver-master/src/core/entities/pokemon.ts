export type PokemonData = {
  id: string;
  name: string;
  level: number;
  basicForm: string;
  ability: string;
  hasMoreEvolution: boolean;
  middleForm?: string;
  middleFormEvolutionLevel?: number;
  finalForm?: string;
  finalFormEvolutionLevel?: number;
};

export type PokemonProps = {
  basicForm: string;
  ability: string;
  level?: number;
  hasMoreEvolution?: boolean;
  middleForm?: string;
  middleFormEvolutionLevel?: number;
  finalForm?: string;
  finalFormEvolutionLevel?: number;
};

export class Pokemon {
  readonly basicForm: string;
  readonly ability: string;
  readonly level: number;
  readonly hasMoreEvolution: boolean;
  readonly middleForm?: string;
  readonly middleFormEvolutionLevel?: number;
  readonly finalForm?: string;
  readonly finalFormEvolutionLevel?: number;

  constructor(props: PokemonProps) {
    this.basicForm = props.basicForm;
    this.ability = props.ability;
    this.level = props.level ?? 1;
    this.hasMoreEvolution = props.hasMoreEvolution ?? true;
    this.middleForm = props.middleForm;
    this.middleFormEvolutionLevel = props.middleFormEvolutionLevel;
    this.finalForm = props.finalForm;
    this.finalFormEvolutionLevel = props.finalFormEvolutionLevel;
  }

  get name(): string {
    if (this.finalForm && this.finalFormEvolutionLevel && this.level >= this.finalFormEvolutionLevel) {
      return this.finalForm;
    }

    if (this.middleForm && this.middleFormEvolutionLevel && this.level >= this.middleFormEvolutionLevel) {
      return this.middleForm;
    }

    return this.basicForm;
  }
}
