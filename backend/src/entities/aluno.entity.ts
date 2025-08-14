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

  // Campos de mensalidade personalizada
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valorMensalidadeCustomizado: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, comment: 'Percentual de desconto (0-100)' })
  percentualDesconto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: 'Valor fixo de desconto em reais' })
  valorDesconto: number;

  @Column({ type: 'text', nullable: true, comment: 'Observações sobre descontos ou valores especiais' })
  observacoesMensalidade: string;

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

  /**
   * Calcula o valor final da mensalidade considerando descontos e valores customizados
   */
  calcularValorMensalidade(): number {
    let valorBase: number;

    // Se tem valor customizado, usa ele, senão usa o valor da turma
    if (this.valorMensalidadeCustomizado !== null && this.valorMensalidadeCustomizado !== undefined) {
      valorBase = Number(this.valorMensalidadeCustomizado);
    } else if (this.turma && this.turma.valorMensalidade) {
      valorBase = Number(this.turma.valorMensalidade);
    } else {
      return 0;
    }

    // Aplica desconto percentual
    if (this.percentualDesconto > 0) {
      valorBase = valorBase * (1 - Number(this.percentualDesconto) / 100);
    }

    // Aplica desconto fixo
    if (this.valorDesconto > 0) {
      valorBase = valorBase - Number(this.valorDesconto);
    }

    // Garante que o valor não seja negativo
    return Math.max(0, valorBase);
  }

  /**
   * Retorna informações detalhadas sobre o cálculo da mensalidade
   */
  getDetalheMensalidade(): {
    valorBase: number;
    valorCustomizado: number | null;
    percentualDesconto: number;
    valorDesconto: number;
    valorFinal: number;
    observacoes: string | null;
  } {
    const valorBase = this.turma?.valorMensalidade ? Number(this.turma.valorMensalidade) : 0;
    const valorFinal = this.calcularValorMensalidade();

    return {
      valorBase,
      valorCustomizado: this.valorMensalidadeCustomizado ? Number(this.valorMensalidadeCustomizado) : null,
      percentualDesconto: Number(this.percentualDesconto),
      valorDesconto: Number(this.valorDesconto),
      valorFinal,
      observacoes: this.observacoesMensalidade
    };
  }
}
