import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Aluno } from './aluno.entity';

@Entity('turmas')
export class Turma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 20 })
  serie: string;

  @Column({ length: 10 })
  turno: string; // manhã, tarde, noite

  @Column({ type: 'int' })
  ano: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorMensalidade: number;

  @Column({ default: true })
  ativa: boolean;

  @CreateDateColumn()
  criadaEm: Date;

  @UpdateDateColumn()
  atualizadaEm: Date;

  @OneToMany(() => Aluno, aluno => aluno.turma)
  alunos: Aluno[];
}
