# Aplicação para emissão de notas fiscais de serviço

a aplicação deve ter entrada restriva para usuarios com senha

deve ter o usuario administrador que pode gerencias outros usuarios

usuario operador que não pode gerenciar outros usuarios

Essa aplicação deve  ter a opção receber uma planilha com dados dos responsaveis financeiros dos alunos necessario e também o nome do aluno e ano, para importar os dados e também tera a opção de cadastrar o responsavel financieiro manualmente

os alunos devem pagar 12 mensalidades escolares por ano

o sitema deve separar os aluno por turmas.

ao abrir as turmas devem ser listados os alunos da respectiva turma

a lista deve ser em forma de tabela

nome dos alunos na vertical e meses das mensalidades na horizontal

em cada celula tera o opção de ticar o mes, isso significará que o pagamento foi feito e o sitema pode tirar nota fiscal do repsctivo mes

o mes ticado ficara em uma fila de notas a emitir

o sistema tera um funcionalidade de emitir notas pendentes, que será a emissão das notas fiscais da fila de notas a emitir

apos a emissão da nota o numero da nota tera que aparecer na tabela dos alunos

ai clicar nesse numero o pdf da nota deverá ser baixado

o sistema deverá terá a opção de exportar todos os dados dos alunos para um planilha


iremos usar a Api do bling para emitir as notas fiscais. 
então devemos observar as referencias e os dados obrigatorios para isso.



























































- **Monitoramento e Logs:** Acompanhamento de performance e erros- **Segurança SSL/HTTPS:** Criptografia de dados em trânsito- **Banco de Dados Gerenciado:** Hospedagem e backup automatizado- **Pipeline de Deploy Automatizado:** Para atualizações contínuas- **Configuração por Ambiente:** Separação entre desenvolvimento e produção- **Digital Ocean App Platform:** Plataforma de hospedagem principal### Hospedagem e Infraestrutura- **Atualizações em Tempo Real:** Para a interface de registro de pontos- **Validação de Formulários:** Feedback em tempo real para usuários- **Design Responsivo:** Compatibilidade com diferentes dispositivos- **Gerenciamento de Estado:** Para o dashboard administrativo- **Arquitetura Baseada em Componentes:** Para reutilização e manutenibilidade- **React.js:** Biblioteca para desenvolvimento das interfaces de usuário### Frontend- **Sistema de Logs:** Para monitoramento e tratamento de erros- **Validação de Dados:** Sanitização e validação de entradas- **ORM de Banco de Dados:** Para gerenciamento e persistência de dados- **Autenticação JWT:** Para controle de sessões dos administradores- **Node.js com NestJS:** Framework para desenvolvimento da API REST### Backend## Tecnologias Utilizadas- Exportação de relatórios em diferentes formatos- Visualização gráfica de informações (opcional)- Filtros e opções de busca para consulta específica de dados  * Relatórios de faltas e atrasos  * Resumos de horas trabalhadas  * Relatórios por período  * Relatórios individuais por funcionário- Geração de relatórios:- Interface de visualização e relatórios### 4. Painel de Informações (Painel Administrativo)- Interface rápida e simplificada para uso contínuo- Acesso público, sem necessidade de autenticação- Feedback visual para registro bem-sucedido- Detecção automática de entrada/saída com base no último registro- Identificação automática do funcionário pelo ID- Campo único para entrada do ID do funcionário### 3. Tela de Serviço (Interface de Registro de Ponto)- Fluxo de registro da empresa- Validação de dados e processo de ativação de conta- Formulário para criação de nova conta de administrador### 2. Tela de Registro- Redirecionamento para o painel administrativo ao efetuar login com sucesso- Gerenciamento de sessão e validação de credenciais- Formulário de autenticação com campos para nome de usuário e senha### 1. Tela de Login## Funcionalidades PrincipaisO Pontok é um sistema de controle de ponto destinado ao registro de entrada e saída de funcionários, com o objetivo de calcular automaticamente as horas trabalhadas para fins de folha de pagamento.## Visão Geral1. Visão Geral do Sistema
O Pontok é um sistema de controle de ponto focado no registro de entradas e saídas de funcionários. Seu objetivo principal é calcular as horas trabalhadas, faltas e atrasos de forma automatizada e precisa, a fim de garantir que os funcionários sejam pagos corretamente e facilitar a gestão da folha de pagamento.

2. Perfis de Usuário
O sistema possuirá dois níveis de acesso distintos:

Administrador: Responsável pela configuração geral do sistema, cadastro de informações da empresa, gerenciamento de funcionários, escalas de trabalho e acesso a relatórios detalhados.

Funcionário: Usuário final que realiza o registro de ponto diário através de um ID único.

3. Interfaces do Sistema
O sistema é composto por diferentes telas, cada uma com um propósito específico.

3.1. Tela de Registro de Ponto (Interface do Funcionário)
Esta é a interface principal para o registro de ponto dos funcionários, projetada para ser rápida e de uso contínuo.

Campo de Identificação: Possui um campo alfanumérico destacado para a inserção do ID único do funcionário.

Registro Automatizado: O sistema identifica o funcionário pelo ID e registra automaticamente o ponto (entrada ou saída) com o horário atual.

Lógica de Entrada/Saída: Identifica automaticamente se o registro é de entrada ou saída, baseando-se no último ponto registrado pelo funcionário.

Feedback Imediato: Fornece uma confirmação visual instantânea para o usuário, confirmando que o registro foi bem-sucedido.

Acesso Direto: Disponível para uso sem a necessidade de login, otimizando o fluxo de registro.

3.2. Tela de Cadastro (Novos Administradores)
Interface destinada ao cadastro de novos administradores interessados em utilizar o sistema.

Formulário de Cadastro: Apresenta os campos necessários para a criação de uma nova conta de administrador.

Validação de Dados: Realiza a validação das informações inseridas.

Ativação de Conta: Processo para ativar a conta após o preenchimento dos dados.

3.3. Tela de Login (Administrador)
Interface de autenticação para que os administradores acessem o painel de controle.

Campos de Credenciais: Contém campos para inserção de login e senha.

Controle de Acesso: Valida as credenciais e gerencia a sessão para garantir o acesso seguro ao painel administrativo.

3.4. Painel Administrativo (Dashboard)
Após o login, o administrador tem acesso a um painel de controle centralizado.

Dashboard: Apresenta um painel com informações consolidadas e resumo dos pontos registrados.

Visualização Gráfica: Permite a visualização gráfica das informações para uma análise mais intuitiva (funcionalidade opcional).

4. Funcionalidades do Administrador
Dentro do painel administrativo, o usuário administrador pode realizar as seguintes operações:

4.1. Gerenciamento de Dados
Dados da Empresa: Inserir e editar as informações da empresa (razão social, CNPJ, endereço, etc.).

Cadastro de Funcionários:

Cadastrar novos funcionários com seus dados pessoais e profissionais.

Editar informações de funcionários existentes.

Remover funcionários do sistema.

Atribuir um ID/senha único para cada funcionário.

Escalas de Trabalho:

Definir diversas escalas de trabalho (horários, dias da semana, carga horária).

Associar escalas de trabalho específicas para cada funcionário ou grupo.

Gerenciar diferentes tipos de jornada de trabalho.

4.2. Emissão de Relatórios
O sistema oferece funcionalidades robustas para a geração de relatórios gerenciais.

Tipos de Relatórios:

Relatórios de horas trabalhadas.

Relatórios de faltas e atrasos.

Relatórios por funcionário específico.

Relatórios por período (diário, semanal, mensal).

Filtros e Buscas: Disponibiliza filtros e opções de busca avançada para a consulta específica de dados.

Exportação: Permite a exportação dos relatórios em diferentes formatos para uso externo (ex: planilhas, PDF).

5. Estrutura de Dados (Conceitual)
O sistema de pontos é composto por várias tabelas que armazenam as informações de forma organizada. As principais tabelas guardam dados sobre os funcionários, seus registros de ponto (com data e hora), faltas e atrasos.



