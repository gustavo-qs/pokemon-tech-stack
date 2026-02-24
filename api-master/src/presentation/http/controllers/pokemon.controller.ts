import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { CreatePokemonUseCase } from '@/core/use-cases/create-pokemon.use-case';
import { UpdatePokemonUseCase } from '@/core/use-cases/update-pokemon.use-case';
import { GetPokemonUseCase } from '@/core/use-cases/get-pokemon.use-case';
import { ListPokemonsUseCase } from '@/core/use-cases/list-pokemons.use-case';

@Controller('pokemon')
export class PokemonController {
  constructor(
    private readonly createUseCase: CreatePokemonUseCase,
    private readonly updateUseCase: UpdatePokemonUseCase,
    private readonly getUseCase: GetPokemonUseCase,
    private readonly listUseCase: ListPokemonsUseCase,
  ) {}

  @Post()
  create(@Body() body) {
    return this.createUseCase.execute(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.updateUseCase.execute({ ...body, id });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.getUseCase.execute({ id });
  }

  @Get()
  findAll(
    @Query('abilities') abilities?: string | string[],
    @Query('hasMoreEvolution') hasMoreEvolution?: string,
  ) {
    const abilitiesArray = abilities
      ? Array.isArray(abilities) ? abilities : [abilities]
      : undefined;

    const hasMoreEvolutionBool = hasMoreEvolution !== undefined
      ? hasMoreEvolution === 'true'
      : undefined;

    return this.listUseCase.execute({
      abilities: abilitiesArray,
      hasMoreEvolution: hasMoreEvolutionBool,
    });
  }
}
