import { PokemonRepository } from '@/core/repositories/pokemon.repository';
import { CreatePokemonDto } from '@/core/use-cases/dto/create-pokemon.dto';
import { CreatePokemonUseCase } from '@/core/use-cases/create-pokemon.use-case';

const makeRepository = (): jest.Mocked<PokemonRepository> =>
  ({
    create: jest.fn(),
    update: jest.fn(),
    updateLevel: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  }) as jest.Mocked<PokemonRepository>;

const validInput: CreatePokemonDto = {
  basicForm: 'Bulbasaur',
  ability: 'Overgrow',
  middleForm: 'Ivysaur',
  middleFormEvolutionLevel: 16,
  finalForm: 'Venusaur',
  finalFormEvolutionLevel: 32,
};

describe(CreatePokemonUseCase.name, () => {
  let useCase: CreatePokemonUseCase;
  let mockRepository: jest.Mocked<PokemonRepository>;

  beforeEach(() => {
    mockRepository = makeRepository();
    useCase = new CreatePokemonUseCase(mockRepository);
  });

  test('should call repository.create with the provided data', async () => {
    mockRepository.create.mockResolvedValue({ id: 'generated-id' });

    await useCase.execute(validInput);

    expect(mockRepository.create).toHaveBeenCalledWith(validInput);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  test('should return the id returned by the repository', async () => {
    mockRepository.create.mockResolvedValue({ id: 'generated-id' });

    const result = await useCase.execute(validInput);

    expect(result).toEqual({ id: 'generated-id' });
  });

  test('should pass minimal input (only required fields) to repository', async () => {
    mockRepository.create.mockResolvedValue({ id: 'minimal-id' });

    const minimalInput: CreatePokemonDto = {
      basicForm: 'Mewtwo',
      ability: 'Pressure',
    };

    await useCase.execute(minimalInput);

    expect(mockRepository.create).toHaveBeenCalledWith(minimalInput);
  });

  test('should propagate errors thrown by the repository', async () => {
    mockRepository.create.mockRejectedValue(new Error('gRPC error'));

    await expect(useCase.execute(validInput)).rejects.toThrow('gRPC error');
  });
});
