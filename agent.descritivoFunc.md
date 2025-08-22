# Aplicação para Gestão escolar

a aplicação deve ter entrada restriva para usuarios com senha

deve ter o usuario administrador que pode gerencias outros usuarios

o administrador deve gerenciar o ano letivo. criar novos anos letivos
o administrador deve gerenciar series escolares e adicionar o valor da mensalidade  exemplo 1 ano 2 ano
o administrador deve gerenciar turmas que petencem a serie - turma a, turma da tia juh, o nome da turma é personalizado

usuario operador que não pode gerenciar outros usuarios

o fluxo de cadastro é assim, o responsavel financeiro faz seu cadastro.
o responsavel financeiro faz cadastro dos alunos viculados a ele.
o responsavel financeiro faz matricula do aluno em uma turma de uma serie escolar

a matricula pode ser entendida como uma entidade chamada contrato

o contrato vincula todos os dados de matricula, turma, serie data de matricula valor e ano letivo entre outros. 

apos a validação do contrato o aluno está matriculado na escola aluno séra incluido na turma, por enquanto a validação do contrato será feito manual pelos adminitradores


quando o aluno é matriculado o sistema já gera 1 fatura em realçao ao valor da matricula e 11 faturas em relação as mensalidades referente a cada mes do ano janeiro a dezembro. a fatura deve ter dia de vencimento, dia 10 do mes que se refere como padrão

se o aluno é matriculado durante o ano levito as faturas são geradas a partir da data de matricula 

Deve haver a entidade fatura no sistema. listando todas as faturas, cada uma fatura é ligada a um contrato


Essa aplicação deve  ter a opção receber uma planilha com dados dos responsaveis financeiros dos alunos necessario e também o nome do aluno e ano, para importar os dados e também tera a opção de cadastrar o responsavel financieiro manualmente





o sitema deve separar os aluno por turmas.

ao abrir as turmas devem ser listados os alunos da respectiva turma

ao clicar no nome do aluno deve ser painel daquele aluno

com as informações daquele aluno, uma aba de controle de faturas

listando forma todas as faturas vinculadas ao aluno

em cada celula tera o opção de ticar o mes, isso significará que o pagamento foi feito e o sitema pode tirar nota fiscal do repsctivo mes

o mes ticado ficara em uma fila de notas a emitir

o sistema tera um funcionalidade de emitir notas pendentes, que será a emissão das notas fiscais da fila de notas a emitir

apos a emissão da nota o numero da nota tera que aparecer na tabela dos alunos

ai clicar nesse numero o pdf da nota deverá ser baixado

o sistema deverá terá a opção de exportar todos os dados dos alunos para um planilha


iremos usar a Api do bling para emitir as notas fiscais. 
então devemos observar as referencias e os dados obrigatorios para isso.




