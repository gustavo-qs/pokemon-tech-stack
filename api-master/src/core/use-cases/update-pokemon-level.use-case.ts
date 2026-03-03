import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { UpdatePokemonLevelDto } from './dto/update-pokemon-level.dto';
import { IBaseUseCase } from './base.interface';

export class UpdatePokemonLevelUseCase
  implements IBaseUseCase<UpdatePokemonLevelDto, void>
{
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute = async (data: UpdatePokemonLevelDto): Promise<void> => {
    return this.pokemonRepository.updateLevel(data);
  };
}
