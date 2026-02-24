import { PokemonRepository } from '../repositories/pokemon.repository';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { IBaseUseCase } from './base.interface';

export class UpdatePokemonUseCase implements IBaseUseCase<UpdatePokemonDto, void> {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute = async (data: UpdatePokemonDto): Promise<void> => {
    return this.pokemonRepository.update(data);
  };
}
