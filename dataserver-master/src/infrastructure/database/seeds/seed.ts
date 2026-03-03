import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.development' });

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME ?? 'pokemon';

const pokemonSchema = new mongoose.Schema(
  {
    basicForm: { type: String, required: true },
    ability: { type: String, required: true },
    level: { type: Number, default: 1 },
    hasMoreEvolution: { type: Boolean, default: true },
    middleForm: { type: String },
    middleFormEvolutionLevel: { type: Number },
    finalForm: { type: String },
    finalFormEvolutionLevel: { type: Number },
  },
  { collection: 'pokemon' },
);

const PokemonModel = mongoose.model('Pokemon', pokemonSchema);

const pokemons = [
  {
    basicForm: 'Bulbasaur',
    ability: 'Overgrow',
    middleForm: 'Ivysaur',
    middleFormEvolutionLevel: 16,
    finalForm: 'Venusaur',
    finalFormEvolutionLevel: 32,
  },
  {
    basicForm: 'Charmander',
    ability: 'Blaze',
    middleForm: 'Charmeleon',
    middleFormEvolutionLevel: 16,
    finalForm: 'Charizard',
    finalFormEvolutionLevel: 36,
  },
  {
    basicForm: 'Squirtle',
    ability: 'Torrent',
    middleForm: 'Wartortle',
    middleFormEvolutionLevel: 16,
    finalForm: 'Blastoise',
    finalFormEvolutionLevel: 36,
  },
  {
    basicForm: 'Machop',
    ability: 'Guts',
    middleForm: 'Machoke',
    middleFormEvolutionLevel: 28,
    finalForm: 'Machamp',
    finalFormEvolutionLevel: 36,
  },
  {
    basicForm: 'Geodude',
    ability: 'Rock Head',
    middleForm: 'Graveler',
    middleFormEvolutionLevel: 25,
    finalForm: 'Golem',
    finalFormEvolutionLevel: 36,
  },
  {
    basicForm: 'Gastly',
    ability: 'Levitate',
    middleForm: 'Haunter',
    middleFormEvolutionLevel: 25,
    finalForm: 'Gengar',
    finalFormEvolutionLevel: 36,
  },
  {
    basicForm: 'Magikarp',
    ability: 'Swift Swim',
    finalForm: 'Gyarados',
    finalFormEvolutionLevel: 20,
  },
  {
    basicForm: 'Eevee',
    ability: 'Run Away',
  },
  {
    basicForm: 'Snorlax',
    ability: 'Immunity',
  },
  {
    basicForm: 'Mewtwo',
    ability: 'Pressure',
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log(`Connected to MongoDB: ${MONGODB_URI}/${MONGODB_DB_NAME}`);

  await PokemonModel.deleteMany({});
  console.log('Cleared existing pokemon collection.');

  const inserted = await PokemonModel.insertMany(pokemons);
  console.log(`Seeded ${inserted.length} pokemons:`);
  inserted.forEach((p) => console.log(`  [${p._id}] ${p.basicForm}`));

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
