import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Turma } from './turma.entity';
import { ResponsavelFinanceiro } from './responsavel-financeiro.entity';
import { Mensalidade } from './mensalidade.entity';

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 11, unique: true })
  matricula: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({ length: 14, nullable: true })
  cpf: string;

  @Column({ length: 20, nullable: true })
  rg: string;

  @Column({ length: 200, nullable: true })
  endereco: string;

  @Column({ length: 15, nullable: true })
  telefone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // Relacionamentos
  @ManyToOne(() => Turma, turma => turma.alunos)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @Column()
  turmaId: number;

  @ManyToOne(() => ResponsavelFinanceiro, responsavel => responsavel.alunos)
  @JoinColumn({ name: 'responsavelFinanceiroId' })
  responsavelFinanceiro: ResponsavelFinanceiro;

  @Column()
  responsavelFinanceiroId: number;

  @OneToMany(() => Mensalidade, mensalidade => mensalidade.aluno)
  mensalidades: Mensalidade[];
}
