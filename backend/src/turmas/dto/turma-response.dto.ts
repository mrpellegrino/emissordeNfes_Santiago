import { TurnoEnum } from './create-turma.dto';

export class TurmaResponseDto {
  id: number;
  nome: string;
  serie: string;
  turno: TurnoEnum;
  ano: number;
  valorMensalidade: number;
  ativa: boolean;
  totalAlunos?: number;
  criadoEm: Date;
  atualizadoEm: Date;

  constructor(partial: Partial<TurmaResponseDto>) {
    Object.assign(this, partial);
  }
}
