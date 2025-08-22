import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipoPessoaToResponsaveis1755190666279 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar coluna tipoPessoa na tabela responsaveis_financeiros
        await queryRunner.query(`
            ALTER TABLE "responsaveis_financeiros" 
            ADD COLUMN "tipoPessoa" integer NOT NULL DEFAULT 1
        `);
        
        // Adicionar comentário explicativo
        await queryRunner.query(`
            COMMENT ON COLUMN "responsaveis_financeiros"."tipoPessoa" IS 
            'Tipo de pessoa: 1 = Pessoa Física, 2 = Pessoa Jurídica, 3 = Pessoa Estrangeiro'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover coluna tipoPessoa
        await queryRunner.query(`
            ALTER TABLE "responsaveis_financeiros" 
            DROP COLUMN "tipoPessoa"
        `);
    }

}
