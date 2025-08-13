# Sistema de Emissão de NFSe para Escolas

Sistema completo para gestão escolar com foco na emissão automatizada de notas fiscais de serviços educacionais através da API do Bling.

## 🚀 Tecnologias

### Backend
- **Node.js** com **NestJS**
- **TypeScript**
- **PostgreSQL** com **TypeORM**
- **JWT** para autenticação
- **Passport** para estratégias de autenticação
- **Axios** para integração com API Bling

### Frontend
- **React.js** com **TypeScript**
- **Vite** como bundler
- **React Router** para roteamento
- **Axios** para chamadas API
- **React Hook Form** para formulários
- **Lucide React** para ícones
- **ExcelJS** para manipulação de planilhas

## 📁 Estrutura do Projeto

```
projeto-base/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── config/         # Configurações (DataSource, etc)
│   │   ├── entities/       # Entidades TypeORM (futuro)
│   │   ├── modules/        # Módulos da aplicação (futuro)
│   │   └── migrations/     # Migrações do banco
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   └── package.json
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── contexts/       # Contextos React
│   │   ├── hooks/          # Hooks customizados
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários
│   └── package.json
├── package.json            # Scripts centralizados
└── docker-compose.yml      # Configuração PostgreSQL
```

## 🛠️ Configuração Inicial

### 1. Instalar Dependências

```bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar individualmente
npm run install:backend
npm run install:frontend
```

### 2. Configurar Banco de Dados

#### Opção 1: Docker (Recomendado)
```bash
docker-compose up -d
```

#### Opção 2: PostgreSQL Local
- Instalar PostgreSQL
- Criar database: `nfse_sistema`
- Configurar no arquivo `.env`

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:
```bash
cp backend/.env.example backend/.env
```

Edite o arquivo `backend/.env` com suas configurações:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=nfse_sistema
JWT_SECRET=seu_jwt_secret_seguro
BLING_API_TOKEN=seu_token_bling
```

## 🚀 Scripts Disponíveis

### Desenvolvimento
```bash
npm run backend          # Inicia apenas o backend
npm run frontend         # Inicia apenas o frontend
npm run dev             # Inicia backend + frontend simultaneamente
```

### Build
```bash
npm run build:backend   # Build do backend
npm run build:frontend  # Build do frontend
```

### Testes
```bash
npm run test:backend    # Testes do backend
npm run test:frontend   # Testes do frontend
```

## 📋 Funcionalidades Principais

### ✅ Configuração Inicial (Concluída)
- [x] Configuração do backend NestJS
- [x] Configuração do frontend React
- [x] Estrutura de pastas organizada
- [x] Scripts npm centralizados
- [x] Configuração do banco de dados
- [x] Tipos TypeScript básicos

### 🔄 Em Desenvolvimento
- [ ] Sistema de autenticação (admin/operador)
- [ ] Gestão de usuários, turmas e alunos
- [ ] Importação de planilhas
- [ ] Interface de mensalidades (tabela alunos x meses)
- [ ] Integração com API Bling para NFSe
- [ ] Fila de emissão de notas
- [ ] Download de PDFs
- [ ] Exportação de relatórios

### 🎯 MVP (Funcionalidades Essenciais)
1. Login com dois perfis (admin/operador)
2. Cadastro manual de alunos e responsáveis
3. Importação via planilha
4. Organização por turmas
5. Tabela de mensalidades (alunos x 12 meses)
6. Marcação de pagamentos
7. Fila automática de emissão
8. Integração com Bling para NFSe
9. Download de PDFs das notas
10. Exportação de dados para planilha

## 🔧 API Endpoints (Planejados)

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Usuários
- `GET /usuarios` - Listar usuários
- `POST /usuarios` - Criar usuário
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Remover usuário

### Turmas
- `GET /turmas` - Listar turmas
- `POST /turmas` - Criar turma
- `GET /turmas/:id/mensalidades` - Mensalidades da turma

### Alunos
- `GET /alunos` - Listar alunos
- `POST /alunos` - Criar aluno
- `POST /alunos/importar` - Importar planilha

### NFSe
- `POST /nfse/processar-fila` - Emitir notas pendentes
- `GET /nfse/:numero/pdf` - Download PDF

## 🤝 Contribuição

1. Clone o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.
