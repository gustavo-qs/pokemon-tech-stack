import { PokemonData } from '@/core/entities/pokemon';
import { NotFoundException } from '@/core/exceptions/not-found.exception';
import { IPokemonRepository } from '@/core/repositories/pokemon.repository';
import { GetPokemonUseCase } from '@/core/use-cases/get-pokemon.use-case';

const makePokemonData = (): PokemonData => ({
  id: 'pokemon-id-1',
  name: 'Bulbasaur',
  level: 1,
  basicForm: 'Bulbasaur',
  ability: 'Overgrow',
  hasMoreEvolution: true,
  middleForm: 'Ivysaur',
  middleFormEvolutionLevel: 16,
  finalForm: 'Venusaur',
  finalFormEvolutionLevel: 32,
});

const makeRepository = (): jest.Mocked<IPokemonRepository> => ({
  create: jest.fn(),
  update: jest.fn(),
  updateLevel: jest.fn(),
  markNoMoreEvolution: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

describe(GetPokemonUseCase.name, () => {
  let useCase: GetPokemonUseCase;
  let mockRepository: jest.Mocked<IPokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new GetPokemonUseCase(mockRepository);
  });

  test('should return pokemon data from repository', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData());

    const result = await useCase.execute({ id: 'pokemon-id-1' });

    expect(result).toEqual(makePokemonData());
  });

  test('should call repository.findById with the correct id', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData());

    await useCase.execute({ id: 'pokemon-id-1' });

    expect(mockRepository.findById).toHaveBeenCalledWith('pokemon-id-1');
    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should propagate NotFoundException when pokemon is not found', async () => {
    mockRepository.findById.mockRejectedValue(
      new NotFoundException('Pokemon with id not-found not found.'),
    );

    await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow(
      NotFoundException,
    );
  });

  test('should propagate generic errors from repository', async () => {
    mockRepository.findById.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute({ id: 'pokemon-id-1' })).rejects.toThrow(
      'DB error',
    );
  });
});
