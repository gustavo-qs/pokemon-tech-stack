import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { CreatePokemonDto } from '@/core/use-cases/dto/create-pokemon.dto';
import { UpdatePokemonDto } from '@/core/use-cases/dto/update-pokemon.dto';
import { PokemonResponseDto } from '@/core/use-cases/dto/get-pokemon.dto';
import { ListPokemonsFiltersDto } from '@/core/use-cases/dto/list-pokemons.dto';
import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PokemonGrpcService } from './services/pokemon.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GRPCPokemonRepository implements PokemonRepository {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.SUPPORT_DATASERVER_IP,
      package: 'pokemon',
      protoPath: join(__dirname, '/protos/pokemon.proto'),
    },
  })
  client: ClientGrpc;

  create(data: CreatePokemonDto): Promise<{ id: string }> {
    return lastValueFrom(
      this.client
        .getService<PokemonGrpcService>('PokemonService')
        .createPokemon(data),
    );
  }

  update(data: UpdatePokemonDto): Promise<void> {
    return lastValueFrom(
      this.client
        .getService<PokemonGrpcService>('PokemonService')
        .updatePokemon(data),
    );
  }

  findById(id: string): Promise<PokemonResponseDto> {
    return lastValueFrom(
      this.client
        .getService<PokemonGrpcService>('PokemonService')
        .getPokemon({ id }),
    );
  }

  async findAll(filters: ListPokemonsFiltersDto): Promise<PokemonResponseDto[]> {
    const response = await lastValueFrom(
      this.client
        .getService<PokemonGrpcService>('PokemonService')
        .listPokemons(filters),
    );
    return response.pokemons;
  }
}
