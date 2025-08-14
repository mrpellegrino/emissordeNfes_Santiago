import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntidades1755112321766 implements MigrationInterface {
    name = 'CreateEntidades1755112321766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "turmas" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "serie" character varying(20) NOT NULL, "turno" character varying(10) NOT NULL, "ano" integer NOT NULL, "valorMensalidade" numeric(10,2) NOT NULL, "ativa" boolean NOT NULL DEFAULT true, "criadaEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadaEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dc45a711f2b6358996a1ab1be6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "responsaveis_financeiros" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "cpfCnpj" character varying(14) NOT NULL, "email" character varying(100) NOT NULL, "telefone" character varying(15) NOT NULL, "endereco" character varying(200) NOT NULL, "cidade" character varying(50) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(8) NOT NULL, "inscricaoEstadual" character varying(20), "inscricaoMunicipal" character varying(20), "razaoSocial" character varying(100), "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_eb1e1e9de1c992d40d23c777f18" UNIQUE ("cpfCnpj"), CONSTRAINT "PK_f4f37b3ab19a0ac12c58a67a52c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alunos" ("id" SERIAL NOT NULL, "matricula" character varying(11) NOT NULL, "nome" character varying(100) NOT NULL, "dataNascimento" date NOT NULL, "cpf" character varying(14), "rg" character varying(20), "endereco" character varying(200), "telefone" character varying(15), "email" character varying(100), "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), "turmaId" integer NOT NULL, "responsavelFinanceiroId" integer NOT NULL, CONSTRAINT "UQ_6e0968af8b901a2773bf17aa366" UNIQUE ("matricula"), CONSTRAINT "PK_0090f2d8573e71e8e4e274db905" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."mensalidades_status_enum" AS ENUM('pendente', 'paga', 'vencida', 'cancelada')`);
        await queryRunner.query(`CREATE TABLE "mensalidades" ("id" SERIAL NOT NULL, "mes" integer NOT NULL, "ano" integer NOT NULL, "valor" numeric(10,2) NOT NULL, "dataVencimento" date NOT NULL, "dataPagamento" date, "status" "public"."mensalidades_status_enum" NOT NULL DEFAULT 'pendente', "observacoes" character varying(200), "numeroNfse" character varying(50), "dataEmissaoNfse" date, "linkPdfNfse" character varying(500), "nfseEmitida" boolean NOT NULL DEFAULT false, "criadaEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadaEm" TIMESTAMP NOT NULL DEFAULT now(), "alunoId" integer NOT NULL, CONSTRAINT "PK_58120adbb098c8ce93e1e56c6fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."fila_emissao_status_enum" AS ENUM('pendente', 'processando', 'sucesso', 'erro')`);
        await queryRunner.query(`CREATE TYPE "public"."fila_emissao_provider_enum" AS ENUM('bling', 'prefeitura')`);
        await queryRunner.query(`CREATE TABLE "fila_emissao" ("id" SERIAL NOT NULL, "status" "public"."fila_emissao_status_enum" NOT NULL DEFAULT 'pendente', "provider" "public"."fila_emissao_provider_enum" NOT NULL DEFAULT 'bling', "tentativas" integer NOT NULL DEFAULT '0', "maxTentativas" integer NOT NULL DEFAULT '3', "ultimoErro" text, "dadosProvider" json, "respostaProvider" json, "dataProcessamento" TIMESTAMP, "proximaTentativa" TIMESTAMP, "criadaEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadaEm" TIMESTAMP NOT NULL DEFAULT now(), "mensalidadeId" integer NOT NULL, "usuarioOperadorId" integer, CONSTRAINT "PK_7537d970ed0dd2cd9fbe2fb73ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_tipo_enum" AS ENUM('admin', 'operador')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "email" character varying(100) NOT NULL, "nome" character varying(100) NOT NULL, "senha" character varying NOT NULL, "tipo" "public"."usuarios_tipo_enum" NOT NULL DEFAULT 'operador', "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "FK_3ec17a7ab8563202182a82d0b6b" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "FK_ab3bd7fe28d6bdddcf02ba3c622" FOREIGN KEY ("responsavelFinanceiroId") REFERENCES "responsaveis_financeiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mensalidades" ADD CONSTRAINT "FK_3815dd8cc9cb84c4d5b06c943c6" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fila_emissao" ADD CONSTRAINT "FK_e7d560571917a8fcb306d36f652" FOREIGN KEY ("mensalidadeId") REFERENCES "mensalidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fila_emissao" ADD CONSTRAINT "FK_6fddc9cbb21f98adc928e9f162e" FOREIGN KEY ("usuarioOperadorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fila_emissao" DROP CONSTRAINT "FK_6fddc9cbb21f98adc928e9f162e"`);
        await queryRunner.query(`ALTER TABLE "fila_emissao" DROP CONSTRAINT "FK_e7d560571917a8fcb306d36f652"`);
        await queryRunner.query(`ALTER TABLE "mensalidades" DROP CONSTRAINT "FK_3815dd8cc9cb84c4d5b06c943c6"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "FK_ab3bd7fe28d6bdddcf02ba3c622"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "FK_3ec17a7ab8563202182a82d0b6b"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "fila_emissao"`);
        await queryRunner.query(`DROP TYPE "public"."fila_emissao_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fila_emissao_status_enum"`);
        await queryRunner.query(`DROP TABLE "mensalidades"`);
        await queryRunner.query(`DROP TYPE "public"."mensalidades_status_enum"`);
        await queryRunner.query(`DROP TABLE "alunos"`);
        await queryRunner.query(`DROP TABLE "responsaveis_financeiros"`);
        await queryRunner.query(`DROP TABLE "turmas"`);
    }

}
