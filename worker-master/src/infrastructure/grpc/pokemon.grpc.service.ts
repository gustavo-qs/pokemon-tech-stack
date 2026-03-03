import { Observable } from 'rxjs';

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

export interface PokemonGrpcService {
  getPokemon(data: { id: string }): Observable<PokemonResponse>;
  markNoMoreEvolution(data: { id: string }): Observable<void>;
}
