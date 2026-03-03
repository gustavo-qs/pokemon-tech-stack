import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { PokemonResponseDto } from '@/core/use-cases/dto/get-pokemon.dto';
import { GetPokemonUseCase } from '@/core/use-cases/get-pokemon.use-case';

const makeRepository = (): jest.Mocked<PokemonRepository> =>
  ({
    create: jest.fn(),
    update: jest.fn(),
    updateLevel: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  }) as jest.Mocked<PokemonRepository>;

const makePokemonResponse = (): PokemonResponseDto => ({
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

describe(GetPokemonUseCase.name, () => {
  let useCase: GetPokemonUseCase;
  let mockRepository: jest.Mocked<PokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new GetPokemonUseCase(mockRepository);
  });

  test('should call repository.findById with the provided id', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonResponse());

    await useCase.execute({ id: 'pokemon-id-1' });

    expect(mockRepository.findById).toHaveBeenCalledWith('pokemon-id-1');
    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return the pokemon data from the repository', async () => {
    const response = makePokemonResponse();
    mockRepository.findById.mockResolvedValue(response);

    const result = await useCase.execute({ id: 'pokemon-id-1' });

    expect(result).toEqual(response);
  });

  test('should propagate errors thrown by the repository', async () => {
    mockRepository.findById.mockRejectedValue(new Error('gRPC not found'));

    await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow(
      'gRPC not found',
    );
  });
});
