# Dataserver

## Descrição

Este é um boilerplate para criação de um dataserver desenvolvido em NestJS, utilizando Clean Code e comunicação via gRPC. Ele se conecta ao banco de dados MongoDB.

## Protobufs

O projeto define dois protobufs:

- Health: fornece serviços de saúde da aplicação, incluindo um método Check para verificar o status de serviço e um método Watch para monitorar o status de serviço.
- Greeter: fornece um serviço de exemplo que retorna uma mensagem de boas-vindas.

## Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

```
NEW_RELIC_APP_NAME: nome do aplicativo New Relic.
NEW_RELIC_LICENSE_KEY: chave de licença do New Relic.
SERVER_IP: endereço IP e porta do servidor (padrão: 0.0.0.0:50051).
```

## Execução

Para executar o projeto, certifique-se de ter rodado o comando `yarn install` e ter configurado as variáveis de ambiente. Em seguida, execute o comando:

```bash
yarn start:dev
```

O servidor estará disponível no endereço http://localhost:50051.
