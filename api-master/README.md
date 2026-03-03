# API Master — Pokémon Manager

Gateway REST do sistema de gerenciamento de Pokémons. Recebe requisições HTTP e as repassa ao Dataserver via gRPC.

## Variáveis de Ambiente

```env
SUPPORT_DATASERVER_IP=localhost:50051
```

## Execução

```bash
yarn install
yarn start:dev
```

Servidor disponível em `http://localhost:3000`.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/pokemon` | Criar Pokémon |
| `PUT` | `/pokemon/:id` | Atualizar dados do Pokémon |
| `PATCH` | `/pokemon/:id/level` | Atualizar nível (dispara SQS via Dataserver) |
| `GET` | `/pokemon/:id` | Buscar Pokémon por ID |
| `GET` | `/pokemon` | Listar Pokémons (filtros opcionais) |

### Query params do `GET /pokemon`

| Param | Tipo | Exemplo |
|-------|------|---------|
| `abilities` | `string[]` | `?abilities=Overgrow&abilities=Blaze` |
| `hasMoreEvolution` | `boolean` | `?hasMoreEvolution=false` |

## Testes

```bash
yarn test        # executa os testes unitários
yarn test:cov    # com relatório de cobertura
```
