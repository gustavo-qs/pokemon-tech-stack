# Dataserver — Pokémon Manager

Servidor gRPC responsável pela lógica de negócio e persistência do sistema de gerenciamento de Pokémons. Conecta-se ao MongoDB e ao SQS.

## Variáveis de Ambiente

```env
SERVER_IP=0.0.0.0:50051
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=pokemon
AWS_REGION=us-east-1
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
SQS_QUEUE_URL=http://localhost:4566/000000000000/pokemon-level-update
```

## Execução

```bash
yarn install
yarn start:dev
```

Servidor gRPC disponível em `0.0.0.0:50051`.

## Proto — PokemonService

```protobuf
service PokemonService {
  rpc CreatePokemon       (CreatePokemonRequest)       returns (CreatePokemonResponse) {}
  rpc UpdatePokemon       (UpdatePokemonRequest)       returns (Empty)                 {}
  rpc UpdatePokemonLevel  (UpdateLevelRequest)         returns (Empty)                 {}
  rpc GetPokemon          (GetPokemonRequest)          returns (PokemonResponse)       {}
  rpc ListPokemons        (ListPokemonsRequest)        returns (ListPokemonsResponse)  {}
  rpc MarkNoMoreEvolution (MarkNoMoreEvolutionRequest) returns (Empty)                 {}
}
```

## Regras de negócio

- Pokémon criado com `level = 1` por padrão
- `UpdatePokemonLevel`: só permite **aumentar** o nível, máximo **100**
- A cada atualização de nível publica mensagem na fila `pokemon-level-update`
- `MarkNoMoreEvolution`: chamado pelo Worker quando o Pokémon atinge a forma final

## Seed

Popula o banco com 10 Pokémons de exemplo:

```bash
yarn seed
```

## Testes

```bash
yarn test        # executa os testes unitários
yarn test:cov    # com relatório de cobertura
```
