import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';
import { IPokemonRepository } from '../repositories/pokemon.repository';
import { IBaseUseCase } from './base';

export type MarkNoMoreEvolutionInput = { id: string };
export type IMarkNoMoreEvolutionUseCase = IBaseUseCase<
  MarkNoMoreEvolutionInput,
  void
>;

export class MarkNoMoreEvolutionUseCase implements IMarkNoMoreEvolutionUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute = async ({ id }: MarkNoMoreEvolutionInput): Promise<void> => {
    if (!id) throw new InvalidArgumentException('id is required.');
    await this.pokemonRepository.markNoMoreEvolution(id);
  };
}
