# 📋 Guia de Testes - API Backend NFSe Sistema

## 🚀 Como Importar no Postman

1. **Abra o Postman**
2. **Clique em "Import"** (botão no canto superior esquerdo)
3. **Selecione o arquivo** `postman-collection.json`
4. **A collection será importada** com todas as requisições organizadas

## 🔐 Configuração de Autenticação

### Passo 1: Login
1. Execute a requisição **"🔐 Autenticação > Login"**
2. Use as credenciais padrão:
   ```json
   {
     "email": "admin@santiago.com",
     "senha": "admin123"
   }
   ```
3. **O token será automaticamente salvo** na variável `{{token}}`

### Passo 2: Verificar Token
- Todas as outras requisições já estão configuradas para usar o token
- O token é enviado automaticamente no header `Authorization: Bearer {{token}}`

## 📁 Estrutura da Collection

### 🔐 Autenticação
- **Login**: Autentica usuário e salva token
- **Obter Perfil**: Retorna dados do usuário logado
- **Validar Token**: Verifica se token ainda é válido

### 👥 Usuários (Apenas Admin)
- **Listar Usuários**: GET /usuarios
- **Criar Usuário**: POST /usuarios
- **Buscar por ID**: GET /usuarios/:id
- **Atualizar**: PATCH /usuarios/:id
- **Ativar/Desativar**: PATCH /usuarios/:id/toggle-active
- **Deletar**: DELETE /usuarios/:id

### 🏫 Turmas
- **Listar Turmas**: GET /turmas
- **Criar Turma**: POST /turmas
- **Buscar por ID**: GET /turmas/:id
- **Atualizar**: PATCH /turmas/:id
- **Ativar/Desativar**: PATCH /turmas/:id/toggle-active
- **Deletar**: DELETE /turmas/:id

### 🎓 Alunos
- **Listar Todos**: GET /alunos
- **Listar por Turma**: GET /alunos?turmaId=1
- **Criar Aluno**: POST /alunos
- **Buscar por ID**: GET /alunos/:id
- **Atualizar**: PATCH /alunos/:id
- **Ativar/Desativar**: PATCH /alunos/:id/toggle-active
- **Deletar**: DELETE /alunos/:id
- **Importar Excel**: POST /alunos/importar (upload de arquivo)
- **🆕 Atualizar Mensalidade**: PATCH /alunos/:id/mensalidade
- **🆕 Consultar Mensalidade**: GET /alunos/:id/mensalidade

## 📊 Dados de Exemplo

### Criar Turma
```json
{
  "nome": "5º Ano A",
  "serie": "5º Ano",
  "turno": "matutino",
  "ano": 2025,
  "valorMensalidade": 450.00
}
```

### Criar Usuário
```json
{
  "nome": "Operador Teste",
  "email": "operador@santiago.com",
  "senha": "operador123",
  "tipo": "operador"
}
```

### Criar Aluno
```json
{
  "nome": "João Silva Santos",
  "matricula": "2025001",
  "dataNascimento": "2015-03-15",
  "cpf": "12345678901",
  "rg": "123456789",
  "endereco": "Rua das Flores, 123 - Centro",
  "telefone": "(11) 99999-9999",
  "email": "joao.santos@email.com",
  "turmaId": 1,
  "responsavelFinanceiroId": 1,
  "valorMensalidadeCustomizado": 500.00,
  "percentualDesconto": 15,
  "valorDesconto": 25.00,
  "observacoesMensalidade": "Aluno com bolsa de estudos - desconto aplicado"
}
```

### 🆕 Atualizar Mensalidade do Aluno
```json
{
  "valorMensalidadeCustomizado": 450.00,
  "percentualDesconto": 10,
  "valorDesconto": 50.00,
  "observacoesMensalidade": "Desconto especial - bolsa de estudos parcial"
}
```

### 🆕 Resposta de Consulta de Mensalidade
```json
{
  "valorBase": 500.00,
  "valorCustomizado": 450.00,
  "percentualDesconto": 10,
  "valorDesconto": 50.00,
  "valorFinal": 355.00,
  "observacoes": "Desconto especial - bolsa de estudos parcial"
}
```

## 📤 Importação de Alunos via Excel

### Formato do Arquivo Excel
O arquivo Excel deve conter as seguintes colunas (na primeira linha):

| Coluna | Nome | Tipo | Obrigatório | Exemplo |
|--------|------|------|-------------|---------|
| A | nome | Texto | ✅ | João Silva Santos |
| B | matricula | Texto | ✅ | 2025001 |
| C | dataNascimento | Data | ✅ | 15/03/2015 |
| D | cpf | Texto | ❌ | 12345678901 |
| E | rg | Texto | ❌ | 123456789 |
| F | endereco | Texto | ❌ | Rua das Flores, 123 |
| G | telefone | Texto | ❌ | (11) 99999-9999 |
| H | email | Email | ❌ | joao@email.com |
| I | turmaId | Número | ✅ | 1 |
| J | responsavelFinanceiroId | Número | ✅ | 1 |

### Exemplo de Planilha Excel

```
nome                | matricula | dataNascimento | cpf         | rg        | endereco           | telefone        | email              | turmaId | responsavelFinanceiroId
João Silva Santos   | 2025001   | 15/03/2015    | 12345678901 | 123456789 | Rua das Flores, 123| (11) 99999-9999 | joao@email.com     | 1       | 1
Maria Oliveira Lima | 2025002   | 22/07/2014    | 98765432100 | 987654321 | Av. Principal, 456 | (11) 88888-8888 | maria@email.com    | 1       | 2
```

### Como Fazer Upload
1. Vá para **"🎓 Alunos > Importar Alunos via Excel"**
2. Na aba **Body**, selecione **form-data**
3. No campo **file**, clique em **"Select Files"**
4. Escolha seu arquivo Excel (.xlsx ou .xls)
5. Execute a requisição

## 🔍 Códigos de Status

| Status | Significado |
|--------|-------------|
| 200 | ✅ Sucesso |
| 201 | ✅ Criado com sucesso |
| 400 | ❌ Dados inválidos |
| 401 | ❌ Não autorizado |
| 403 | ❌ Acesso negado |
| 404 | ❌ Não encontrado |
| 500 | ❌ Erro interno do servidor |

## 🛠️ Variáveis Disponíveis

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `{{baseUrl}}` | http://localhost:3000 | URL base da API |
| `{{token}}` | (automático) | Token de autenticação JWT |

## 📝 Notas Importantes

1. **Sempre faça login primeiro** para obter o token
2. **Apenas usuários admin** podem gerenciar outros usuários
3. **Turmas devem existir** antes de criar alunos
4. **Responsáveis financeiros devem existir** antes de criar alunos
5. **Datas devem estar no formato** `YYYY-MM-DD` ou `DD/MM/YYYY`
6. **CPF e telefone são opcionais** mas recomendados
7. **Matrículas devem ser únicas** por aluno

## 🚨 Resolução de Problemas

### Token Expirado
- Execute novamente a requisição de **Login**
- O token será automaticamente atualizado

### Erro 403 (Acesso Negado)
- Verifique se você está logado com usuário admin
- Alguns endpoints são restritos apenas para administradores

### Erro 400 (Dados Inválidos)
- Verifique os campos obrigatórios
- Confirme o formato das datas
- Verifique se IDs de turma e responsável existem

### Erro de Upload Excel
- Certifique-se de que o arquivo é .xlsx ou .xls
- Verifique se as colunas estão na ordem correta
- Confirme se as turmas e responsáveis existem no sistema
