import { Pokemon, PokemonProps } from '../entities/pokemon';
import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';
import { IPokemonRepository } from '../repositories/pokemon.repository';
import { IBaseUseCase } from './base';

export type UpdatePokemonInput = PokemonProps & { id: string };

export type IUpdatePokemonUseCase = IBaseUseCase<UpdatePokemonInput, void>;

export class UpdatePokemonUseCase implements IUpdatePokemonUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute = async ({ id, ...props }: UpdatePokemonInput): Promise<void> => {
    if (!id) throw new InvalidArgumentException('id is required.');
    if (!props.basicForm) throw new InvalidArgumentException('basicForm is required.');
    if (!props.ability) throw new InvalidArgumentException('ability is required.');

    const pokemon = new Pokemon(props);

    await this.pokemonRepository.update(id, pokemon);
  };
}
