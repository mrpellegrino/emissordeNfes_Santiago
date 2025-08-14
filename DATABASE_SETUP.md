# Configuração do Banco de Dados - PostgreSQL

## Opção 1: Docker (Recomendado)

### Pré-requisitos
- Docker Desktop instalado e rodando

### Comandos
```bash
# Iniciar todos os serviços (PostgreSQL + PgAdmin)
docker-compose up -d

# Iniciar apenas PostgreSQL
docker-compose up postgres -d

# Verificar status
docker-compose ps

# Parar serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### Acessos
- **PostgreSQL**: localhost:5432
- **PgAdmin**: http://localhost:8080
  - Email: admin@nfse.com
  - Senha: admin123

## Opção 2: Instalação Local

### Windows
1. Baixar PostgreSQL: https://www.postgresql.org/download/windows/
2. Instalar com as seguintes configurações:
   - Porta: 5432
   - Usuário: postgres
   - Senha: senha
3. Criar database:
   ```sql
   CREATE DATABASE nfse_sistema;
   ```

### Configuração do Backend
Certifique-se de que o arquivo `.env` está configurado:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=senha
DATABASE_NAME=nfse_sistema
```

## Verificação da Conexão

### Usando o Backend
```bash
cd backend
npm run start:dev
```

Se a conexão estiver correta, você verá:
```
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [NestApplication] Nest application successfully started
```

### Usando psql (linha de comando)
```bash
psql -h localhost -p 5432 -U postgres -d nfse_sistema
```

## Migrações

### Gerar migração
```bash
cd backend
npm run migration:generate -- src/migrations/NomeDaMigracao
```

### Executar migrações
```bash
cd backend
npm run migration:run
```

### Reverter migração
```bash
cd backend
npm run migration:revert
```

## Scripts Úteis

### Backup
```bash
pg_dump -h localhost -p 5432 -U postgres nfse_sistema > backup.sql
```

### Restore
```bash
psql -h localhost -p 5432 -U postgres nfse_sistema < backup.sql
```

## Troubleshooting

### Erro de conexão
1. Verificar se PostgreSQL está rodando
2. Verificar configurações do .env
3. Verificar firewall (porta 5432)

### Docker não inicia
1. Verificar se Docker Desktop está instalado
2. Verificar se Docker Desktop está rodando
3. Verificar recursos disponíveis (RAM/CPU)
