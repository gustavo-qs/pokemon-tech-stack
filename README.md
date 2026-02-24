# Pokémon Tech Stack — NestJS

Sistema de gerenciamento de Pokémons construído com arquitetura de microsserviços usando NestJS, gRPC e MongoDB.

---

## Arquitetura

```
Client (HTTP)
    │
    ▼
┌─────────────┐        gRPC        ┌──────────────────┐
│  api-master │ ─────────────────► │ dataserver-master │
│  :3000      │                    │  :50051           │
└─────────────┘                    └────────┬─────────┘
                                            │
                                     ┌──────▼──────┐
                                     │   MongoDB   │
                                     └─────────────┘
                                            ▲
┌─────────────┐        gRPC                │
│worker-master│ ───────────────────────────┘
│  :3000      │
│  SQS ◄──── │◄──── pokemon-level-update queue
└─────────────┘
```

| Serviço | Responsabilidade | Porta |
|---------|-----------------|-------|
| **api-master** | Gateway REST — recebe requisições HTTP e repassa via gRPC | 3000 |
| **dataserver-master** | Lógica de negócio + persistência MongoDB via gRPC server | 50051 |
| **worker-master** | Consumidor SQS — processa eventos de level update assíncronos | 3000 |

> A API e o Worker **nunca** acessam o banco diretamente — apenas via Dataserver por gRPC.

---

## Entidade Pokémon

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String | Identificador gerado pelo MongoDB |
| `name` | String | **Derivado** — forma atual baseada no `level` |
| `level` | Number | Nível atual (default 1, máx 100) |
| `basicForm` | String | Nome da forma base |
| `ability` | String | Habilidade do Pokémon |
| `hasMoreEvolution` | Boolean | `false` quando atingiu a forma final |
| `middleForm` | String? | Nome da forma intermediária |
| `middleFormEvolutionLevel` | Number? | Nível necessário para evoluir para a forma intermediária |
| `finalForm` | String? | Nome da forma final |
| `finalFormEvolutionLevel` | Number? | Nível necessário para evoluir para a forma final |

### Regra de evolução (`name`)

```
level >= finalFormEvolutionLevel  → name = finalForm
level >= middleFormEvolutionLevel → name = middleForm
caso contrário                    → name = basicForm
```

---

## Rotas HTTP (api-master — porta 3000)

### Criar Pokémon
```
POST /pokemon
```
**Body:**
```json
{
  "basicForm": "Bulbasaur",
  "ability": "Overgrow",
  "middleForm": "Ivysaur",
  "middleFormEvolutionLevel": 16,
  "finalForm": "Venusaur",
  "finalFormEvolutionLevel": 32
}
```
**Response `201`:**
```json
{ "id": "64f3a1b2c8e9d12345abcdef" }
```

---

### Atualizar Pokémon
```
PUT /pokemon/:id
```
**Body:** mesmos campos do create (sem `id`).

**Response `200`:** vazio (sucesso).

---

### Buscar Pokémon por ID
```
GET /pokemon/:id
```
**Response `200`:**
```json
{
  "id": "64f3a1b2c8e9d12345abcdef",
  "name": "Ivysaur",
  "level": 20,
  "basicForm": "Bulbasaur",
  "ability": "Overgrow",
  "hasMoreEvolution": true,
  "middleForm": "Ivysaur",
  "middleFormEvolutionLevel": 16,
  "finalForm": "Venusaur",
  "finalFormEvolutionLevel": 32
}
```

---

### Listar Pokémons
```
GET /pokemon
GET /pokemon?abilities=Overgrow
GET /pokemon?abilities=Overgrow&abilities=Blaze
GET /pokemon?hasMoreEvolution=false
GET /pokemon?abilities=Overgrow&hasMoreEvolution=true
```

**Query params (opcionais):**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `abilities` | `string[]` | Filtra por uma ou mais habilidades |
| `hasMoreEvolution` | `boolean` | Filtra por status de evolução |

**Response `200`:** array de objetos Pokémon (mesmo shape do GET por id).

---

## Configuração

### api-master (`.env`)
```env
SUPPORT_DATASERVER_IP=0.0.0.0:50051
```

### dataserver-master (`.env`)
```env
SERVER_IP=0.0.0.0:50051
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=pokemon
```

### worker-master (`.env`)
```env
SUPPORT_DATASERVER_IP=0.0.0.0:50051
PROCESS_MESSAGE_QUEUE_NAME=pokemon-level-update
PROCESS_MESSAGE_QUEUE_URL=<sqs-url>
AWS_REGION=us-east-1
```

---

## gRPC — Proto (compartilhado entre os 3 serviços)

```protobuf
service PokemonService {
  rpc CreatePokemon       (CreatePokemonRequest)  returns (CreatePokemonResponse) {}
  rpc UpdatePokemon       (UpdatePokemonRequest)  returns (Empty)                 {}
  rpc GetPokemon          (GetPokemonRequest)     returns (PokemonResponse)       {}
  rpc ListPokemons        (ListPokemonsRequest)   returns (ListPokemonsResponse)  {}
  rpc UpdatePokemonLevel  (UpdateLevelRequest)    returns (Empty)                 {}
  rpc MarkNoMoreEvolution (MarkNoMoreEvolutionRequest) returns (Empty)            {}
}
```

---

## Estrutura de diretórios (por serviço)

```
src/
├── core/
│   ├── entities/          # Entidades de domínio e regras de negócio
│   ├── repositories/      # Interfaces de repositório (sem dependência de infra)
│   └── use-cases/
│       ├── dto/           # Tipos de entrada e saída
│       └── *.use-case.ts  # Lógica de negócio — alvo principal dos testes
├── infrastructure/        # Adaptadores: Mongoose, gRPC client, SQS
└── presentation/          # Controllers HTTP/gRPC, módulos NestJS, proto files
```

---

## Stack

- **Framework:** NestJS
- **Comunicação inter-serviços:** gRPC + Protocol Buffers
- **Banco de dados:** MongoDB (Mongoose)
- **Fila assíncrona:** Amazon SQS (`pokemon-level-update`)