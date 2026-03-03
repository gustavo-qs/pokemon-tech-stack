import { InvalidArgumentException } from '@/core/exceptions/invalid-argument.exception';
import { NotFoundException } from '@/core/exceptions/not-found.exception';
import { IPokemonRepository } from '@/core/repositories/pokemon.repository';
import { MarkNoMoreEvolutionUseCase } from '@/core/use-cases/mark-no-more-evolution.use-case';

describe(MarkNoMoreEvolutionUseCase.name, () => {
  let useCase: MarkNoMoreEvolutionUseCase;
  let mockRepository: jest.Mocked<IPokemonRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      updateLevel: jest.fn(),
      markNoMoreEvolution: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new MarkNoMoreEvolutionUseCase(mockRepository);
  });

  test('should throw when id is missing', async () => {
    await expect(useCase.execute({ id: '' })).rejects.toThrow(
      InvalidArgumentException,
    );
  });

  test('should call markNoMoreEvolution on repository', async () => {
    await useCase.execute({ id: 'pokemon-id-1' });

    expect(mockRepository.markNoMoreEvolution).toHaveBeenCalledWith(
      'pokemon-id-1',
    );
  });

  test('should propagate NotFoundException from repository', async () => {
    mockRepository.markNoMoreEvolution.mockRejectedValue(
      new NotFoundException('Pokemon with id not-found not found.'),
    );

    await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
