import { InvalidArgumentException } from '@/core/exceptions/invalid-argument.exception';
import { NotFoundException } from '@/core/exceptions/not-found.exception';
import { IPokemonRepository } from '@/core/repositories/pokemon.repository';
import { PokemonData } from '@/core/entities/pokemon';
import { UpdateLevelUseCase } from '@/core/use-cases/update-level.use-case';
import { SqsProducerService } from '@/infrastructure/messaging/sqs.producer';

const makePokemonData = (level = 1): PokemonData => ({
  id: 'pokemon-id-1',
  name: 'Bulbasaur',
  level,
  basicForm: 'Bulbasaur',
  ability: 'Overgrow',
  hasMoreEvolution: true,
  middleForm: 'Ivysaur',
  middleFormEvolutionLevel: 16,
  finalForm: 'Venusaur',
  finalFormEvolutionLevel: 32,
});

describe(UpdateLevelUseCase.name, () => {
  let useCase: UpdateLevelUseCase;
  let mockRepository: jest.Mocked<IPokemonRepository>;
  let mockSqsProducer: jest.Mocked<SqsProducerService>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      updateLevel: jest.fn().mockResolvedValue(undefined),
      markNoMoreEvolution: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    mockSqsProducer = {
      publishLevelUpdate: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<SqsProducerService>;

    useCase = new UpdateLevelUseCase(mockRepository, mockSqsProducer);
  });

  test('should throw when id is missing', async () => {
    await expect(
      useCase.execute({ id: '', level: 10 }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw when level is missing', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData(1));

    await expect(
      useCase.execute({ id: 'pokemon-id-1', level: undefined as any }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw when pokemon is not found', async () => {
    mockRepository.findById.mockRejectedValue(
      new NotFoundException('Pokemon with id not-found not found.'),
    );

    await expect(
      useCase.execute({ id: 'not-found', level: 5 }),
    ).rejects.toThrow(NotFoundException);
  });

  test('should throw when new level is lower than current level', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData(20));

    await expect(
      useCase.execute({ id: 'pokemon-id-1', level: 10 }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw when new level equals current level', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData(20));

    await expect(
      useCase.execute({ id: 'pokemon-id-1', level: 20 }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should throw when new level exceeds 100', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData(50));

    await expect(
      useCase.execute({ id: 'pokemon-id-1', level: 101 }),
    ).rejects.toThrow(InvalidArgumentException);
  });

  test('should update level and publish to SQS on success', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData(1));

    await useCase.execute({ id: 'pokemon-id-1', level: 16 });

    expect(mockRepository.updateLevel).toHaveBeenCalledWith('pokemon-id-1', 16);
    expect(mockSqsProducer.publishLevelUpdate).toHaveBeenCalledWith(
      'pokemon-id-1',
      16,
    );
  });

  test('should allow setting level to exactly 100', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData(50));

    await useCase.execute({ id: 'pokemon-id-1', level: 100 });

    expect(mockRepository.updateLevel).toHaveBeenCalledWith('pokemon-id-1', 100);
    expect(mockSqsProducer.publishLevelUpdate).toHaveBeenCalledWith(
      'pokemon-id-1',
      100,
    );
  });

  test('should not publish to SQS if updateLevel throws', async () => {
    mockRepository.findById.mockResolvedValue(makePokemonData(1));
    mockRepository.updateLevel.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute({ id: 'pokemon-id-1', level: 10 }),
    ).rejects.toThrow('DB error');

    expect(mockSqsProducer.publishLevelUpdate).not.toHaveBeenCalled();
  });
});
