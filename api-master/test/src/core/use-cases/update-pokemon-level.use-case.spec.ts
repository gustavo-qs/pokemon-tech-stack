import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { UpdatePokemonLevelDto } from '@/core/use-cases/dto/update-pokemon-level.dto';
import { UpdatePokemonLevelUseCase } from '@/core/use-cases/update-pokemon-level.use-case';

const makeRepository = (): jest.Mocked<PokemonRepository> =>
  ({
    create: jest.fn(),
    update: jest.fn(),
    updateLevel: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  }) as jest.Mocked<PokemonRepository>;

describe(UpdatePokemonLevelUseCase.name, () => {
  let useCase: UpdatePokemonLevelUseCase;
  let mockRepository: jest.Mocked<PokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new UpdatePokemonLevelUseCase(mockRepository);
  });

  test('should call repository.updateLevel with the provided data', async () => {
    mockRepository.updateLevel.mockResolvedValue(undefined);

    const input: UpdatePokemonLevelDto = { id: 'pokemon-id-1', level: 20 };
    await useCase.execute(input);

    expect(mockRepository.updateLevel).toHaveBeenCalledWith(input);
    expect(mockRepository.updateLevel).toHaveBeenCalledTimes(1);
  });

  test('should resolve without returning a value on success', async () => {
    mockRepository.updateLevel.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: 'pokemon-id-1', level: 50 });

    expect(result).toBeUndefined();
  });

  test('should forward the correct id and level to the repository', async () => {
    mockRepository.updateLevel.mockResolvedValue(undefined);

    await useCase.execute({ id: 'specific-id', level: 100 });

    expect(mockRepository.updateLevel).toHaveBeenCalledWith({
      id: 'specific-id',
      level: 100,
    });
  });

  test('should propagate errors thrown by the repository', async () => {
    mockRepository.updateLevel.mockRejectedValue(new Error('gRPC error'));

    await expect(
      useCase.execute({ id: 'pokemon-id-1', level: 20 }),
    ).rejects.toThrow('gRPC error');
  });
});
