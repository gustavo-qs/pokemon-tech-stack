import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';
import { IPokemonRepository } from '../repositories/pokemon.repository';
import { SqsProducerService } from '../../infrastructure/messaging/sqs.producer';
import { IBaseUseCase } from './base';

export type UpdateLevelInput = { id: string; level: number };
export type IUpdateLevelUseCase = IBaseUseCase<UpdateLevelInput, void>;

export class UpdateLevelUseCase implements IUpdateLevelUseCase {
  constructor(
    private readonly pokemonRepository: IPokemonRepository,
    private readonly sqsProducer: SqsProducerService,
  ) {}

  execute = async ({ id, level }: UpdateLevelInput): Promise<void> => {
    if (!id) throw new InvalidArgumentException('id is required.');
    if (level === undefined || level === null) throw new InvalidArgumentException('level is required.');

    const pokemon = await this.pokemonRepository.findById(id);

    switch (true) {
      case level < pokemon.level:
        throw new InvalidArgumentException('Level cannot be decreased.');

      case level > 100:
        throw new InvalidArgumentException('Level cannot exceed 100.');

      case level === pokemon.level:
        throw new InvalidArgumentException('Level is already at the specified value.');

      default:
        break;
    }

    await this.pokemonRepository.updateLevel(id, level);
    await this.sqsProducer.publishLevelUpdate(id, level);
  };
}
