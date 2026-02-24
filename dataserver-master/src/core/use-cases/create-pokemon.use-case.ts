import { Pokemon, PokemonProps } from '../entities/pokemon';
import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';
import { IPokemonRepository } from '../repositories/pokemon.repository';
import { IBaseUseCase } from './base';

export type ICreatePokemonUseCase = IBaseUseCase<PokemonProps, { id: string }>;

export class CreatePokemonUseCase implements ICreatePokemonUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute = async (input: PokemonProps): Promise<{ id: string }> => {
    if (!input.basicForm) throw new InvalidArgumentException('basicForm is required.');
    if (!input.ability) throw new InvalidArgumentException('ability is required.');

    const pokemon = new Pokemon(input);

    return this.pokemonRepository.create(pokemon);
  };
}
