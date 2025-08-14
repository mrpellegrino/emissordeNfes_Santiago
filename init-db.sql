-- Script de inicialização do banco de dados NFSe
-- Este script é executado automaticamente quando o container é criado pela primeira vez

-- Configurações do banco
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Comentário sobre o banco
COMMENT ON DATABASE nfse_sistema IS 'Sistema de Emissão de NFSe para Escolas';

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'Banco de dados NFSe inicializado com sucesso!';
    RAISE NOTICE 'Extensões criadas: uuid-ossp, pg_trgm';
    RAISE NOTICE 'Pronto para receber as migrações do TypeORM';
END $$;
