import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Aluno } from './aluno.entity';

@Entity('responsaveis_financeiros')
export class ResponsavelFinanceiro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 14, unique: true })
  cpfCnpj: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 15 })
  telefone: string;

  @Column({ length: 200 })
  endereco: string;

  @Column({ length: 50 })
  cidade: string;

  @Column({ length: 2 })
  estado: string;

  @Column({ length: 8 })
  cep: string;

  @Column({ length: 20, nullable: true })
  inscricaoEstadual: string;

  @Column({ length: 20, nullable: true })
  inscricaoMunicipal: string;

  // Dados específicos para emissão de NFSe
  @Column({ length: 100, nullable: true })
  razaoSocial: string; // Para quando for CNPJ

  @Column({ type: 'int', comment: '1=Pessoa Física, 2=Pessoa Jurídica, 3=Estrangeiro' })
  tipoPessoa: number;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @OneToMany(() => Aluno, aluno => aluno.responsavelFinanceiro)
  alunos: Aluno[];

  // Método helper para obter descrição do tipo de pessoa
  get tipoPessoaDescricao(): string {
    switch (this.tipoPessoa) {
      case 1: return 'Pessoa Física';
      case 2: return 'Pessoa Jurídica';
      case 3: return 'Estrangeiro';
      default: return 'Não definido';
    }
  }
}
