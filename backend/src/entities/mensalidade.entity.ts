import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Aluno } from './aluno.entity';
import { FilaEmissao } from './fila-emissao.entity';

export enum StatusMensalidade {
  PENDENTE = 'pendente',
  PAGA = 'paga',
  VENCIDA = 'vencida',
  CANCELADA = 'cancelada'
}

@Entity('mensalidades')
export class Mensalidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  mes: number; // 1-12

  @Column({ type: 'int' })
  ano: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'date' })
  dataVencimento: Date;

  @Column({ type: 'date', nullable: true })
  dataPagamento: Date;

  @Column({
    type: 'enum',
    enum: StatusMensalidade,
    default: StatusMensalidade.PENDENTE
  })
  status: StatusMensalidade;

  @Column({ length: 200, nullable: true })
  observacoes: string;

  // Dados para NFSe (preenchidos quando for emitir)
  @Column({ length: 50, nullable: true })
  numeroNfse: string;

  @Column({ type: 'date', nullable: true })
  dataEmissaoNfse: Date;

  @Column({ length: 500, nullable: true })
  linkPdfNfse: string;

  @Column({ default: false })
  nfseEmitida: boolean;

  @CreateDateColumn()
  criadaEm: Date;

  @UpdateDateColumn()
  atualizadaEm: Date;

  // Relacionamentos
  @ManyToOne(() => Aluno, aluno => aluno.mensalidades)
  @JoinColumn({ name: 'alunoId' })
  aluno: Aluno;

  @Column()
  alunoId: number;

  @OneToMany(() => FilaEmissao, fila => fila.mensalidade)
  filaEmissao: FilaEmissao[];

  // Método helper para descrição da mensalidade
  get descricao(): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `Mensalidade ${meses[this.mes - 1]}/${this.ano}`;
  }
}
