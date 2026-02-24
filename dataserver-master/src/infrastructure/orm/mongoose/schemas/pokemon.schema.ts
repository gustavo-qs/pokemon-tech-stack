import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonDocument = HydratedDocument<PokemonSchemaClass>;

@Schema({ collection: 'pokemon' })
export class PokemonSchemaClass {
  @Prop({ required: true })
  basicForm: string;

  @Prop({ required: true })
  ability: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: true })
  hasMoreEvolution: boolean;

  @Prop()
  middleForm?: string;

  @Prop()
  middleFormEvolutionLevel?: number;

  @Prop()
  finalForm?: string;

  @Prop()
  finalFormEvolutionLevel?: number;
}

export const PokemonSchema = SchemaFactory.createForClass(PokemonSchemaClass);
