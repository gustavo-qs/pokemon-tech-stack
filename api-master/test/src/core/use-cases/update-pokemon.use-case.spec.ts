import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { UpdatePokemonDto } from '@/core/use-cases/dto/update-pokemon.dto';
import { UpdatePokemonUseCase } from '@/core/use-cases/update-pokemon.use-case';

const makeRepository = (): jest.Mocked<PokemonRepository> =>
  ({
    create: jest.fn(),
    update: jest.fn(),
    updateLevel: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  }) as jest.Mocked<PokemonRepository>;

const validInput: UpdatePokemonDto = {
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
  let mockRepository: jest.Mocked<PokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new UpdatePokemonUseCase(mockRepository);
  });

  test('should call repository.update with the provided data', async () => {
    mockRepository.update.mockResolvedValue(undefined);

    await useCase.execute(validInput);

    expect(mockRepository.update).toHaveBeenCalledWith(validInput);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
  });

  test('should resolve without returning a value on success', async () => {
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(result).toBeUndefined();
  });

  test('should forward the complete dto including id to the repository', async () => {
    mockRepository.update.mockResolvedValue(undefined);

    const input: UpdatePokemonDto = {
      id: 'specific-id',
      basicForm: 'Charmander',
      ability: 'Blaze',
    };

    await useCase.execute(input);

    expect(mockRepository.update).toHaveBeenCalledWith(input);
  });

  test('should propagate errors thrown by the repository', async () => {
    mockRepository.update.mockRejectedValue(new Error('gRPC error'));

    await expect(useCase.execute(validInput)).rejects.toThrow('gRPC error');
  });
});
