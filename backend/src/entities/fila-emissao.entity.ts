import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Mensalidade } from './mensalidade.entity';

export enum StatusFilaEmissao {
  PENDENTE = 'pendente',
  PROCESSANDO = 'processando',
  SUCESSO = 'sucesso',
  ERRO = 'erro'
}

export enum TipoProvider {
  BLING = 'bling',
  PREFEITURA = 'prefeitura'
}

@Entity('fila_emissao')
export class FilaEmissao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusFilaEmissao,
    default: StatusFilaEmissao.PENDENTE
  })
  status: StatusFilaEmissao;

  @Column({
    type: 'enum',
    enum: TipoProvider,
    default: TipoProvider.BLING
  })
  provider: TipoProvider;

  @Column({ type: 'int', default: 0 })
  tentativas: number;

  @Column({ type: 'int', default: 3 })
  maxTentativas: number;

  @Column({ type: 'text', nullable: true })
  ultimoErro: string;

  @Column({ type: 'json', nullable: true })
  dadosProvider: any; // Dados específicos do provider (ex: ID no Bling)

  @Column({ type: 'json', nullable: true })
  respostaProvider: any; // Resposta completa do provider

  @Column({ type: 'timestamp', nullable: true })
  dataProcessamento: Date;

  @Column({ type: 'timestamp', nullable: true })
  proximaTentativa: Date;

  @CreateDateColumn()
  criadaEm: Date;

  @UpdateDateColumn()
  atualizadaEm: Date;

  // Relacionamentos
  @ManyToOne(() => Mensalidade, mensalidade => mensalidade.filaEmissao)
  @JoinColumn({ name: 'mensalidadeId' })
  mensalidade: Mensalidade;

  @Column()
  mensalidadeId: number;

  @ManyToOne(() => Usuario, usuario => usuario.emissoesProcessadas, { nullable: true })
  @JoinColumn({ name: 'usuarioOperadorId' })
  usuarioOperador: Usuario;

  @Column({ nullable: true })
  usuarioOperadorId: number;

  // Método helper para verificar se pode tentar novamente
  get podeReitentar(): boolean {
    return this.tentativas < this.maxTentativas && 
           this.status === StatusFilaEmissao.ERRO &&
           (!this.proximaTentativa || this.proximaTentativa <= new Date());
  }
}
