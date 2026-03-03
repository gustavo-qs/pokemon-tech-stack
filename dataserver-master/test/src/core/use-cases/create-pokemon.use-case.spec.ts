import { Pokemon } from '@/core/entities/pokemon';
import { InvalidArgumentException } from '@/core/exceptions/invalid-argument.exception';
import { IPokemonRepository } from '@/core/repositories/pokemon.repository';
import { CreatePokemonUseCase } from '@/core/use-cases/create-pokemon.use-case';

const makeRepository = (): jest.Mocked<IPokemonRepository> => ({
  create: jest.fn().mockResolvedValue({ id: 'generated-id' }),
  update: jest.fn(),
  updateLevel: jest.fn(),
  markNoMoreEvolution: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

describe(CreatePokemonUseCase.name, () => {
  let useCase: CreatePokemonUseCase;
  let mockRepository: jest.Mocked<IPokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new CreatePokemonUseCase(mockRepository);
  });

  test('should throw when basicForm is missing', async () => {
    await expect(
      useCase.execute({ basicForm: '', ability: 'Overgrow' }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw when ability is missing', async () => {
    await expect(
      useCase.execute({ basicForm: 'Bulbasaur', ability: '' }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw with correct message when basicForm is missing', async () => {
    await expect(
      useCase.execute({ basicForm: '', ability: 'Overgrow' }),
    ).rejects.toThrow('basicForm is required.');
  });

  test('should throw with correct message when ability is missing', async () => {
    await expect(
      useCase.execute({ basicForm: 'Bulbasaur', ability: '' }),
    ).rejects.toThrow('ability is required.');
  });

  test('should return the id from repository on success', async () => {
    const result = await useCase.execute({
      basicForm: 'Bulbasaur',
      ability: 'Overgrow',
    });

    expect(result).toEqual({ id: 'generated-id' });
  });

  test('should call repository.create with a Pokemon entity', async () => {
    await useCase.execute({ basicForm: 'Bulbasaur', ability: 'Overgrow' });

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    const [calledWith] = mockRepository.create.mock.calls[0];
    expect(calledWith).toBeInstanceOf(Pokemon);
  });

  test('should create pokemon with default level 1', async () => {
    await useCase.execute({ basicForm: 'Bulbasaur', ability: 'Overgrow' });

    const [pokemon] = mockRepository.create.mock.calls[0];
    expect(pokemon.level).toBe(1);
  });

  test('should create pokemon with all optional fields when provided', async () => {
    await useCase.execute({
      basicForm: 'Bulbasaur',
      ability: 'Overgrow',
      middleForm: 'Ivysaur',
      middleFormEvolutionLevel: 16,
      finalForm: 'Venusaur',
      finalFormEvolutionLevel: 32,
    });

    const [pokemon] = mockRepository.create.mock.calls[0];
    expect(pokemon.middleForm).toBe('Ivysaur');
    expect(pokemon.middleFormEvolutionLevel).toBe(16);
    expect(pokemon.finalForm).toBe('Venusaur');
    expect(pokemon.finalFormEvolutionLevel).toBe(32);
  });

  test('should propagate errors from repository', async () => {
    mockRepository.create.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute({ basicForm: 'Bulbasaur', ability: 'Overgrow' }),
    ).rejects.toThrow('DB error');
  });
});
