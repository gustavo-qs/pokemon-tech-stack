import { Pokemon } from '@/core/entities/pokemon';
import { InvalidArgumentException } from '@/core/exceptions/invalid-argument.exception';
import { NotFoundException } from '@/core/exceptions/not-found.exception';
import { IPokemonRepository } from '@/core/repositories/pokemon.repository';
import { UpdatePokemonUseCase } from '@/core/use-cases/update-pokemon.use-case';

const makeRepository = (): jest.Mocked<IPokemonRepository> => ({
  create: jest.fn(),
  update: jest.fn().mockResolvedValue(undefined),
  updateLevel: jest.fn(),
  markNoMoreEvolution: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

const validInput = {
  id: 'pokemon-id-1',
  basicForm: 'Bulbasaur',
  ability: 'Overgrow',
  middleForm: 'Ivysaur',
  middleFormEvolutionLevel: 16,
  finalForm: 'Venusaur',
  finalFormEvolutionLevel: 32,
};

describe(UpdatePokemonUseCase.name, () => {
  let useCase: UpdatePokemonUseCase;
  let mockRepository: jest.Mocked<IPokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new UpdatePokemonUseCase(mockRepository);
  });

  test('should throw when id is missing', async () => {
    await expect(
      useCase.execute({ ...validInput, id: '' }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw with correct message when id is missing', async () => {
    await expect(
      useCase.execute({ ...validInput, id: '' }),
    ).rejects.toThrow('id is required.');
  });

  test('should throw when basicForm is missing', async () => {
    await expect(
      useCase.execute({ ...validInput, basicForm: '' }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw with correct message when basicForm is missing', async () => {
    await expect(
      useCase.execute({ ...validInput, basicForm: '' }),
    ).rejects.toThrow('basicForm is required.');
  });

  test('should throw when ability is missing', async () => {
    await expect(
      useCase.execute({ ...validInput, ability: '' }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw with correct message when ability is missing', async () => {
    await expect(
      useCase.execute({ ...validInput, ability: '' }),
    ).rejects.toThrow('ability is required.');
  });

  test('should call repository.update with id and a Pokemon entity', async () => {
    await useCase.execute(validInput);

    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    const [id, pokemon] = mockRepository.update.mock.calls[0];
    expect(id).toBe('pokemon-id-1');
    expect(pokemon).toBeInstanceOf(Pokemon);
  });

  test('should pass all fields to the Pokemon entity', async () => {
    await useCase.execute(validInput);

    const [, pokemon] = mockRepository.update.mock.calls[0];
    expect(pokemon.basicForm).toBe('Bulbasaur');
    expect(pokemon.ability).toBe('Overgrow');
    expect(pokemon.middleForm).toBe('Ivysaur');
    expect(pokemon.middleFormEvolutionLevel).toBe(16);
    expect(pokemon.finalForm).toBe('Venusaur');
    expect(pokemon.finalFormEvolutionLevel).toBe(32);
  });

  test('should resolve without returning a value on success', async () => {
    const result = await useCase.execute(validInput);
    expect(result).toBeUndefined();
  });

  test('should propagate NotFoundException from repository', async () => {
    mockRepository.update.mockRejectedValue(
      new NotFoundException('Pokemon with id pokemon-id-1 not found.'),
    );

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundException);
  });

  test('should propagate generic errors from repository', async () => {
    mockRepository.update.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(validInput)).rejects.toThrow('DB error');
  });
});
