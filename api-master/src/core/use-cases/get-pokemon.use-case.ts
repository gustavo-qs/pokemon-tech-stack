import { PokemonRepository } from '../repositories/pokemon.repository';
import { PokemonResponseDto } from './dto/get-pokemon.dto';
import { IBaseUseCase } from './base.interface';

export class GetPokemonUseCase implements IBaseUseCase<{ id: string }, PokemonResponseDto> {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute = async ({ id }: { id: string }): Promise<PokemonResponseDto> => {
    return this.pokemonRepository.findById(id);
  };
}
