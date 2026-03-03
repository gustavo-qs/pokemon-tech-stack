# Worker Master — Pokémon Manager

Consumidor SQS responsável por processar eventos de atualização de nível dos Pokémons. Quando um Pokémon atinge sua forma final, notifica o Dataserver via gRPC para marcar `hasMoreEvolution = false`.

## Variáveis de Ambiente

```env
PORT=3001
DATASERVER_IP=localhost:50051
PROCESS_MESSAGE_QUEUE_NAME=pokemon-level-update
PROCESS_MESSAGE_QUEUE_URL=http://localhost:4566/000000000000/pokemon-level-update
AWS_REGION=us-east-1
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

## Execução

```bash
yarn install
yarn start:dev
```

Health check disponível em `http://localhost:3001/healthcheck`.

## Fluxo de processamento

```
SQS: pokemon-level-update
  → recebe { id, pokemonId, level }
  → GetPokemon via gRPC → obtém estado atual do Pokémon
  → se level >= finalFormEvolutionLevel e finalForm existe
      → MarkNoMoreEvolution via gRPC → hasMoreEvolution = false
  → caso contrário → nenhuma ação
```

## Testes

```bash
yarn test        # executa os testes unitários
yarn test:cov    # com relatório de cobertura
```
