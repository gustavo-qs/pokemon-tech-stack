import { PokemonRepository } from '../repositories/pokemon.repository';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { IBaseUseCase } from './base.interface';

export class CreatePokemonUseCase
  implements IBaseUseCase<CreatePokemonDto, { id: string }>
{
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute = async (data: CreatePokemonDto): Promise<{ id: string }> => {
    return this.pokemonRepository.create(data);
  };
}
