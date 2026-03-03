import { TestBed } from '@automock/jest';
import { Logger } from '@nestjs/common';

import { PokemonLevelUpdate } from '@/core/entities/pokemon-level-update';
import { ProcessPokemonLevelUpdateUseCase } from '@/core/use-cases/process-pokemon-level-update.use-case';
import { PokemonGrpcClientService } from '@/infrastructure/grpc/pokemon.grpc.client.service';
import { PokemonResponse } from '@/infrastructure/grpc/pokemon.grpc.service';

const makePokemonResponse = (overrides: Partial<PokemonResponse> = {}): PokemonResponse => ({
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
  ...overrides,
});

const makeInput = (overrides: Partial<PokemonLevelUpdate> = {}): PokemonLevelUpdate =>
  new PokemonLevelUpdate(
    overrides.id ?? 'msg-id-1',
    overrides.pokemonId ?? 'pokemon-id-1',
    overrides.level ?? 32,
  );

describe(ProcessPokemonLevelUpdateUseCase.name, () => {
  let useCase: ProcessPokemonLevelUpdateUseCase;
  let mockGrpcClient: jest.Mocked<PokemonGrpcClientService>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(ProcessPokemonLevelUpdateUseCase).compile();
    useCase = unit;
    mockGrpcClient = unitRef.get(PokemonGrpcClientService);
    loggerSpy = jest.spyOn(Logger.prototype, 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when pokemon reached final form', () => {
    test('should call markNoMoreEvolution with pokemonId', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ level: 32, finalFormEvolutionLevel: 32 }),
      );
      mockGrpcClient.markNoMoreEvolution.mockResolvedValue(undefined);

      await useCase.execute(makeInput());

      expect(mockGrpcClient.markNoMoreEvolution).toHaveBeenCalledWith('pokemon-id-1');
      expect(mockGrpcClient.markNoMoreEvolution).toHaveBeenCalledTimes(1);
    });

    test('should call markNoMoreEvolution when level exceeds finalFormEvolutionLevel', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ level: 100, finalFormEvolutionLevel: 32 }),
      );
      mockGrpcClient.markNoMoreEvolution.mockResolvedValue(undefined);

      await useCase.execute(makeInput());

      expect(mockGrpcClient.markNoMoreEvolution).toHaveBeenCalledTimes(1);
    });

    test('should log reaching final form message', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ level: 32, finalFormEvolutionLevel: 32 }),
      );
      mockGrpcClient.markNoMoreEvolution.mockResolvedValue(undefined);

      await useCase.execute(makeInput());

      expect(loggerSpy).toHaveBeenCalledWith(
        'Pokemon pokemon-id-1 reached final form. Marked as no more evolution.',
      );
    });
  });

  describe('when pokemon has not reached final form', () => {
    test('should NOT call markNoMoreEvolution when level is below finalFormEvolutionLevel', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ level: 20, finalFormEvolutionLevel: 32 }),
      );

      await useCase.execute(makeInput());

      expect(mockGrpcClient.markNoMoreEvolution).not.toHaveBeenCalled();
    });

    test('should NOT call markNoMoreEvolution when pokemon has no finalForm', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ finalForm: undefined, finalFormEvolutionLevel: undefined, level: 100 }),
      );

      await useCase.execute(makeInput());

      expect(mockGrpcClient.markNoMoreEvolution).not.toHaveBeenCalled();
    });

    test('should NOT call markNoMoreEvolution when finalFormEvolutionLevel is undefined', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ finalFormEvolutionLevel: undefined, level: 100 }),
      );

      await useCase.execute(makeInput());

      expect(mockGrpcClient.markNoMoreEvolution).not.toHaveBeenCalled();
    });

    test('should log "no action" message when not reached final form', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ level: 10, finalFormEvolutionLevel: 32 }),
      );

      await useCase.execute(makeInput());

      expect(loggerSpy).toHaveBeenCalledWith(
        'Pokemon pokemon-id-1 has not reached final form yet. No action taken.',
      );
    });
  });

  describe('logging', () => {
    test('should log processing message at start', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(makePokemonResponse({ level: 1 }));

      await useCase.execute(makeInput({ id: 'msg-id-1', pokemonId: 'pokemon-id-1' }));

      expect(loggerSpy).toHaveBeenCalledWith(
        'Processing level update message id: msg-id-1 for pokemon: pokemon-id-1',
      );
    });
  });

  describe('gRPC client calls', () => {
    test('should call getPokemon with pokemonId', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(makePokemonResponse({ level: 1 }));

      await useCase.execute(makeInput({ pokemonId: 'pokemon-id-42' }));

      expect(mockGrpcClient.getPokemon).toHaveBeenCalledWith('pokemon-id-42');
      expect(mockGrpcClient.getPokemon).toHaveBeenCalledTimes(1);
    });

    test('should propagate errors from getPokemon', async () => {
      mockGrpcClient.getPokemon.mockRejectedValue(new Error('gRPC error'));

      await expect(useCase.execute(makeInput())).rejects.toThrow('gRPC error');
    });

    test('should propagate errors from markNoMoreEvolution', async () => {
      mockGrpcClient.getPokemon.mockResolvedValue(
        makePokemonResponse({ level: 32, finalFormEvolutionLevel: 32 }),
      );
      mockGrpcClient.markNoMoreEvolution.mockRejectedValue(new Error('gRPC error'));

      await expect(useCase.execute(makeInput())).rejects.toThrow('gRPC error');
    });
  });
});
