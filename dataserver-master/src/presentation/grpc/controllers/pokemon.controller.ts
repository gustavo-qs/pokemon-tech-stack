import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreatePokemonRequest, CreatePokemonResponse, GetPokemonRequest, ListPokemonsRequest, ListPokemonsResponse, PokemonResponse, UpdatePokemonRequest } from './dtos/pokemon.dto';
import { ICreatePokemonUseCase } from '@/core/use-cases/create-pokemon.use-case';
import { IUpdatePokemonUseCase } from '@/core/use-cases/update-pokemon.use-case';
import { IGetPokemonUseCase } from '@/core/use-cases/get-pokemon.use-case';
import { IListPokemonsUseCase } from '@/core/use-cases/list-pokemons.use-case';

@Controller()
export class PokemonGrpcController {
  constructor(
    @Inject('ICreatePokemonUseCase')
    private readonly createUseCase: ICreatePokemonUseCase,
    @Inject('IUpdatePokemonUseCase')
    private readonly updateUseCase: IUpdatePokemonUseCase,
    @Inject('IGetPokemonUseCase')
    private readonly getUseCase: IGetPokemonUseCase,
    @Inject('IListPokemonsUseCase')
    private readonly listUseCase: IListPokemonsUseCase,
  ) {}

  @GrpcMethod('PokemonService', 'CreatePokemon')
  async createPokemon(data: CreatePokemonRequest): Promise<CreatePokemonResponse> {
    return this.createUseCase.execute(data);
  }

  @GrpcMethod('PokemonService', 'UpdatePokemon')
  async updatePokemon(data: UpdatePokemonRequest): Promise<{}> {
    await this.updateUseCase.execute(data);
    return {};
  }

  @GrpcMethod('PokemonService', 'GetPokemon')
  async getPokemon(data: GetPokemonRequest): Promise<PokemonResponse> {
    return this.getUseCase.execute(data);
  }

  @GrpcMethod('PokemonService', 'ListPokemons')
  async listPokemons(data: ListPokemonsRequest): Promise<ListPokemonsResponse> {
    const pokemons = await this.listUseCase.execute({
      abilities: data.abilities?.length ? data.abilities : undefined,
      hasMoreEvolution: data.hasMoreEvolution,
    });
    return { pokemons };
  }
}
