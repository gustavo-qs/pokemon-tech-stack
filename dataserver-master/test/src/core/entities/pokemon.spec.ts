import { Pokemon } from '@/core/entities/pokemon';

describe(Pokemon.name, () => {
  describe('defaults', () => {
    test('should default level to 1', () => {
      const pokemon = new Pokemon({ basicForm: 'Bulbasaur', ability: 'Overgrow' });
      expect(pokemon.level).toBe(1);
    });

    test('should default hasMoreEvolution to true', () => {
      const pokemon = new Pokemon({ basicForm: 'Bulbasaur', ability: 'Overgrow' });
      expect(pokemon.hasMoreEvolution).toBe(true);
    });

    test('should respect level when provided', () => {
      const pokemon = new Pokemon({ basicForm: 'Bulbasaur', ability: 'Overgrow', level: 50 });
      expect(pokemon.level).toBe(50);
    });

    test('should respect hasMoreEvolution when provided', () => {
      const pokemon = new Pokemon({ basicForm: 'Bulbasaur', ability: 'Overgrow', hasMoreEvolution: false });
      expect(pokemon.hasMoreEvolution).toBe(false);
    });
  });

  describe('name getter', () => {
    const baseProps = {
      basicForm: 'Bulbasaur',
      ability: 'Overgrow',
      middleForm: 'Ivysaur',
      middleFormEvolutionLevel: 16,
      finalForm: 'Venusaur',
      finalFormEvolutionLevel: 32,
    };

    test('should return basicForm when level is below middleFormEvolutionLevel', () => {
      const pokemon = new Pokemon({ ...baseProps, level: 1 });
      expect(pokemon.name).toBe('Bulbasaur');
    });

    test('should return basicForm when level is just below middleFormEvolutionLevel', () => {
      const pokemon = new Pokemon({ ...baseProps, level: 15 });
      expect(pokemon.name).toBe('Bulbasaur');
    });

    test('should return middleForm when level equals middleFormEvolutionLevel', () => {
      const pokemon = new Pokemon({ ...baseProps, level: 16 });
      expect(pokemon.name).toBe('Ivysaur');
    });

    test('should return middleForm when level is between middle and final evolution levels', () => {
      const pokemon = new Pokemon({ ...baseProps, level: 20 });
      expect(pokemon.name).toBe('Ivysaur');
    });

    test('should return finalForm when level equals finalFormEvolutionLevel', () => {
      const pokemon = new Pokemon({ ...baseProps, level: 32 });
      expect(pokemon.name).toBe('Venusaur');
    });

    test('should return finalForm when level exceeds finalFormEvolutionLevel', () => {
      const pokemon = new Pokemon({ ...baseProps, level: 100 });
      expect(pokemon.name).toBe('Venusaur');
    });

    test('should return basicForm when no evolution forms are configured', () => {
      const pokemon = new Pokemon({ basicForm: 'Mewtwo', ability: 'Pressure', level: 100 });
      expect(pokemon.name).toBe('Mewtwo');
    });

    test('should return middleForm when only two-stage evolution is configured', () => {
      const pokemon = new Pokemon({
        basicForm: 'Pichu',
        ability: 'Static',
        middleForm: 'Pikachu',
        middleFormEvolutionLevel: 10,
        level: 10,
      });
      expect(pokemon.name).toBe('Pikachu');
    });

    test('should ignore finalForm if finalFormEvolutionLevel is not set', () => {
      const pokemon = new Pokemon({
        basicForm: 'Bulbasaur',
        ability: 'Overgrow',
        middleForm: 'Ivysaur',
        middleFormEvolutionLevel: 16,
        finalForm: 'Venusaur',
        // finalFormEvolutionLevel omitted
        level: 50,
      });
      expect(pokemon.name).toBe('Ivysaur');
    });
  });
});
