import { Exclude } from 'class-transformer';

export class AlunoResponseDto {
  id: number;
  nome: string;
  matricula: string;
  dataNascimento: Date;
  cpf?: string;
  rg?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  turma?: {
    id: number;
    nome: string;
    serie: string;
  };
  responsavelFinanceiro?: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
  };
  criadoEm: Date;
  atualizadoEm: Date;
}
