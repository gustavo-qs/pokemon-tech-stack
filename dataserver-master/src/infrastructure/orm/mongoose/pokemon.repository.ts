import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon, PokemonData } from '@/core/entities/pokemon';
import { FindAllFilters, IPokemonRepository } from '@/core/repositories/pokemon.repository';
import { NotFoundException } from '@/core/exceptions/not-found.exception';
import { PokemonDocument, PokemonSchemaClass } from './schemas/pokemon.schema';

@Injectable()
export class MongoosePokemonRepository implements IPokemonRepository {
  constructor(
    @InjectModel(PokemonSchemaClass.name)
    private readonly model: Model<PokemonDocument>,
  ) {}

  async create(pokemon: Pokemon): Promise<{ id: string }> {
    const doc = new this.model({
      basicForm: pokemon.basicForm,
      ability: pokemon.ability,
      level: pokemon.level,
      hasMoreEvolution: pokemon.hasMoreEvolution,
      middleForm: pokemon.middleForm,
      middleFormEvolutionLevel: pokemon.middleFormEvolutionLevel,
      finalForm: pokemon.finalForm,
      finalFormEvolutionLevel: pokemon.finalFormEvolutionLevel,
    });

    await doc.save();

    return { id: doc._id.toString() };
  }

  async update(id: string, pokemon: Pokemon): Promise<void> {
    const result = await this.model.findByIdAndUpdate(id, {
      basicForm: pokemon.basicForm,
      ability: pokemon.ability,
      middleForm: pokemon.middleForm,
      middleFormEvolutionLevel: pokemon.middleFormEvolutionLevel,
      finalForm: pokemon.finalForm,
      finalFormEvolutionLevel: pokemon.finalFormEvolutionLevel,
    });

    if (!result) throw new NotFoundException(`Pokemon with id ${id} not found.`);
  }

  async findById(id: string): Promise<PokemonData> {
    const doc = await this.model.findById(id);

    if (!doc) throw new NotFoundException(`Pokemon with id ${id} not found.`);

    const pokemon = new Pokemon({
      basicForm: doc.basicForm,
      ability: doc.ability,
      level: doc.level,
      hasMoreEvolution: doc.hasMoreEvolution,
      middleForm: doc.middleForm,
      middleFormEvolutionLevel: doc.middleFormEvolutionLevel,
      finalForm: doc.finalForm,
      finalFormEvolutionLevel: doc.finalFormEvolutionLevel,
    });

    return {
      id: doc._id.toString(),
      name: pokemon.name,
      level: pokemon.level,
      basicForm: pokemon.basicForm,
      ability: pokemon.ability,
      hasMoreEvolution: pokemon.hasMoreEvolution,
      middleForm: pokemon.middleForm,
      middleFormEvolutionLevel: pokemon.middleFormEvolutionLevel,
      finalForm: pokemon.finalForm,
      finalFormEvolutionLevel: pokemon.finalFormEvolutionLevel,
    };
  }

  async findAll(filters: FindAllFilters): Promise<PokemonData[]> {
    const query: Record<string, unknown> = {};

    if (filters.abilities && filters.abilities.length > 0) {
      query.ability = { $in: filters.abilities };
    }

    if (filters.hasMoreEvolution !== undefined) {
      query.hasMoreEvolution = filters.hasMoreEvolution;
    }

    const docs = await this.model.find(query);

    return docs.map((doc) => {
      const pokemon = new Pokemon({
        basicForm: doc.basicForm,
        ability: doc.ability,
        level: doc.level,
        hasMoreEvolution: doc.hasMoreEvolution,
        middleForm: doc.middleForm,
        middleFormEvolutionLevel: doc.middleFormEvolutionLevel,
        finalForm: doc.finalForm,
        finalFormEvolutionLevel: doc.finalFormEvolutionLevel,
      });

      return {
        id: doc._id.toString(),
        name: pokemon.name,
        level: pokemon.level,
        basicForm: pokemon.basicForm,
        ability: pokemon.ability,
        hasMoreEvolution: pokemon.hasMoreEvolution,
        middleForm: pokemon.middleForm,
        middleFormEvolutionLevel: pokemon.middleFormEvolutionLevel,
        finalForm: pokemon.finalForm,
        finalFormEvolutionLevel: pokemon.finalFormEvolutionLevel,
      };
    });
  }
}
