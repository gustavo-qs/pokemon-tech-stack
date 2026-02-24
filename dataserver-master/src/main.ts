import 'dotenv/config';
// import 'newrelic';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/presentation/modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { INestMicroservice } from '@nestjs/common';
import { ReflectionService } from '@grpc/reflection';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { GrpcExceptionFilter } from '@/presentation/grpc/filters/rpc-exception.filter';

async function bootstrap() {
  const app: INestMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: ['helloworld', 'grpc.health.v1', 'pokemon'],
        protoPath: [
          join(__dirname, 'presentation/grpc/protos/helloworld.proto'),
          join(__dirname, 'presentation/grpc/protos/health.proto'),
          join(__dirname, 'presentation/grpc/protos/pokemon.proto'),
        ],
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
      bufferLogs: true,
    });

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.listen();
}
bootstrap();
