# Support Api

## Descrição

Boilerplate para API, desenvolvido em NestJS, utilizando Clean Code e comunicação via Rest. Ele se conecta ao Boilerplate Dataserver.

## Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

```
NEW_RELIC_APP_NAME: nome do aplicativo New Relic.
NEW_RELIC_LICENSE_KEY: chave de licença do New Relic.
SUPPORT_DATASERVER_IP: endereço IP e porta do servidor dataserver (padrão: 0.0.0.0:50051).
```

## Execução

Para executar o projeto, certifique-se de ter rodado o comando `yarn install` e ter configurado as variáveis de ambiente. Em seguida, execute o comando:

```bash
yarn start:dev
```

O servidor estará disponível no endereço http://localhost:3000.
