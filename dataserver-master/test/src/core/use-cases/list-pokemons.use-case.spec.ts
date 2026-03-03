import { PokemonData } from '@/core/entities/pokemon';
import { IPokemonRepository } from '@/core/repositories/pokemon.repository';
import { ListPokemonsUseCase } from '@/core/use-cases/list-pokemons.use-case';

const makePokemonData = (overrides: Partial<PokemonData> = {}): PokemonData => ({
  id: 'pokemon-id-1',
  name: 'Bulbasaur',
  level: 1,
  basicForm: 'Bulbasaur',
  ability: 'Overgrow',
  hasMoreEvolution: true,
  ...overrides,
});

const makeRepository = (): jest.Mocked<IPokemonRepository> => ({
  create: jest.fn(),
  update: jest.fn(),
  updateLevel: jest.fn(),
  markNoMoreEvolution: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

describe(ListPokemonsUseCase.name, () => {
  let useCase: ListPokemonsUseCase;
  let mockRepository: jest.Mocked<IPokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new ListPokemonsUseCase(mockRepository);
  });

  test('should return all pokemons when no filters are provided', async () => {
    const pokemons = [makePokemonData(), makePokemonData({ id: 'pokemon-id-2', name: 'Charmander', basicForm: 'Charmander' })];
    mockRepository.findAll.mockResolvedValue(pokemons);

    const result = await useCase.execute({});

    expect(result).toEqual(pokemons);
  });

  test('should call repository.findAll with the provided filters', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await useCase.execute({ abilities: ['Overgrow'], hasMoreEvolution: true });

    expect(mockRepository.findAll).toHaveBeenCalledWith({
      abilities: ['Overgrow'],
      hasMoreEvolution: true,
    });
  });

  test('should pass abilities filter to repository', async () => {
    mockRepository.findAll.mockResolvedValue([makePokemonData()]);

    await useCase.execute({ abilities: ['Overgrow', 'Blaze'] });

    expect(mockRepository.findAll).toHaveBeenCalledWith({
      abilities: ['Overgrow', 'Blaze'],
    });
  });

  test('should pass hasMoreEvolution filter to repository', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await useCase.execute({ hasMoreEvolution: false });

    expect(mockRepository.findAll).toHaveBeenCalledWith({ hasMoreEvolution: false });
  });

  test('should return empty array when no pokemons match', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute({ abilities: ['NonExistentAbility'] });

    expect(result).toEqual([]);
  });

  test('should call repository.findAll exactly once', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await useCase.execute({});

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('should propagate errors from repository', async () => {
    mockRepository.findAll.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute({})).rejects.toThrow('DB error');
  });
});
