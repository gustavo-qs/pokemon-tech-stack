import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { PokemonResponseDto } from '@/core/use-cases/dto/get-pokemon.dto';
import { ListPokemonsFiltersDto } from '@/core/use-cases/dto/list-pokemons.dto';
import { ListPokemonsUseCase } from '@/core/use-cases/list-pokemons.use-case';

const makeRepository = (): jest.Mocked<PokemonRepository> =>
  ({
    create: jest.fn(),
    update: jest.fn(),
    updateLevel: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  }) as jest.Mocked<PokemonRepository>;

const makePokemonResponse = (overrides: Partial<PokemonResponseDto> = {}): PokemonResponseDto => ({
  id: 'pokemon-id-1',
  name: 'Bulbasaur',
  level: 1,
  basicForm: 'Bulbasaur',
  ability: 'Overgrow',
  hasMoreEvolution: true,
  ...overrides,
});

describe(ListPokemonsUseCase.name, () => {
  let useCase: ListPokemonsUseCase;
  let mockRepository: jest.Mocked<PokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new ListPokemonsUseCase(mockRepository);
  });

  test('should call repository.findAll with the provided filters', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const filters: ListPokemonsFiltersDto = { abilities: ['Overgrow'], hasMoreEvolution: true };
    await useCase.execute(filters);

    expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('should return the list of pokemons from the repository', async () => {
    const pokemons = [
      makePokemonResponse(),
      makePokemonResponse({ id: 'pokemon-id-2', name: 'Charmander', basicForm: 'Charmander', ability: 'Blaze' }),
    ];
    mockRepository.findAll.mockResolvedValue(pokemons);

    const result = await useCase.execute({});

    expect(result).toEqual(pokemons);
  });

  test('should return empty array when no pokemons match', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute({ abilities: ['NonExistent'] });

    expect(result).toEqual([]);
  });

  test('should pass abilities filter to the repository', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await useCase.execute({ abilities: ['Overgrow', 'Blaze'] });

    expect(mockRepository.findAll).toHaveBeenCalledWith({
      abilities: ['Overgrow', 'Blaze'],
    });
  });

  test('should pass hasMoreEvolution filter to the repository', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await useCase.execute({ hasMoreEvolution: false });

    expect(mockRepository.findAll).toHaveBeenCalledWith({ hasMoreEvolution: false });
  });

  test('should pass empty filters object when no filters provided', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await useCase.execute({});

    expect(mockRepository.findAll).toHaveBeenCalledWith({});
  });

  test('should propagate errors thrown by the repository', async () => {
    mockRepository.findAll.mockRejectedValue(new Error('gRPC error'));

    await expect(useCase.execute({})).rejects.toThrow('gRPC error');
  });
});
