import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';

@Injectable()
export class SqsProducerService {
  private readonly logger = new Logger(SqsProducerService.name);
  private readonly client: SQSClient;

  constructor() {
    this.client = new SQSClient({
      region: process.env.AWS_REGION ?? 'us-east-1',
      ...(process.env.AWS_ENDPOINT_URL
        ? { endpoint: process.env.AWS_ENDPOINT_URL }
        : {}),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'test',
      },
    });
  }

  async publishLevelUpdate(pokemonId: string, level: number): Promise<void> {
    const queueUrl = process.env.SQS_QUEUE_URL;

    try {
      await this.client.send(
        new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify({ id: randomUUID(), pokemonId, level }),
        }),
      );

      this.logger.log(
        `Published level update for pokemon ${pokemonId} to SQS (level: ${level})`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to publish level update for pokemon ${pokemonId} to SQS: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }
  }
}
