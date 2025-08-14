import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { FilaEmissao } from './fila-emissao.entity';

export enum TipoUsuario {
  ADMIN = 'admin',
  OPERADOR = 'operador'
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  nome: string;

  @Column()
  @Exclude()
  senha: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.OPERADOR
  })
  tipo: TipoUsuario;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @OneToMany(() => FilaEmissao, fila => fila.usuarioOperador)
  emissoesProcessadas: FilaEmissao[];
}
