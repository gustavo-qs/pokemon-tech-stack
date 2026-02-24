Para usar este código:

1. Salve os arquivos com a extensão `.tf`

2. Certifique-se de que o LocalStack está rodando

3. Execute os comandos Terraform:
```bash
terraform init
terraform plan
terraform apply
```

Algumas observações:

- O endpoint configurado no provider aponta para o LocalStack na porta 4566
- As credenciais (access_key e secret_key) são definidas como "test" pois o LocalStack não requer credenciais reais
- As configurações das filas (delay_seconds, max_message_size, etc.) podem ser ajustadas conforme sua necessidade
- Os outputs mostrarão as URLs das filas após a criação
