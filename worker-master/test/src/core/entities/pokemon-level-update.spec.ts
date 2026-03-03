import { PokemonLevelUpdate } from '@/core/entities/pokemon-level-update';

describe(PokemonLevelUpdate.name, () => {
  test('should create entity with correct properties', () => {
    const entity = new PokemonLevelUpdate('msg-id-1', 'pokemon-id-1', 32);

    expect(entity.id).toBe('msg-id-1');
    expect(entity.pokemonId).toBe('pokemon-id-1');
    expect(entity.level).toBe(32);
  });

  test('should create entity as instance of PokemonLevelUpdate', () => {
    const entity = new PokemonLevelUpdate('msg-id-1', 'pokemon-id-1', 32);
    expect(entity).toBeInstanceOf(PokemonLevelUpdate);
  });

  test('all properties should be readonly', () => {
    const entity = new PokemonLevelUpdate('msg-id-1', 'pokemon-id-1', 32);

    expect(entity.id).toBe('msg-id-1');
    expect(entity.pokemonId).toBe('pokemon-id-1');
    expect(entity.level).toBe(32);
  });
});
