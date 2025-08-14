import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMensalidadeFieldsToAluno1755177496791 implements MigrationInterface {
    name = 'AddMensalidadeFieldsToAluno1755177496791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" ADD "valorMensalidadeCustomizado" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD "percentualDesconto" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "alunos"."percentualDesconto" IS 'Percentual de desconto (0-100)'`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD "valorDesconto" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "alunos"."valorDesconto" IS 'Valor fixo de desconto em reais'`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD "observacoesMensalidade" text`);
        await queryRunner.query(`COMMENT ON COLUMN "alunos"."observacoesMensalidade" IS 'Observações sobre descontos ou valores especiais'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "alunos"."observacoesMensalidade" IS 'Observações sobre descontos ou valores especiais'`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "observacoesMensalidade"`);
        await queryRunner.query(`COMMENT ON COLUMN "alunos"."valorDesconto" IS 'Valor fixo de desconto em reais'`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "valorDesconto"`);
        await queryRunner.query(`COMMENT ON COLUMN "alunos"."percentualDesconto" IS 'Percentual de desconto (0-100)'`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "percentualDesconto"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "valorMensalidadeCustomizado"`);
    }

}
