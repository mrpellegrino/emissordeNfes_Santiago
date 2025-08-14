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
  
  // Campos de mensalidade
  valorMensalidadeCustomizado?: number;
  percentualDesconto: number;
  valorDesconto: number;
  observacoesMensalidade?: string;
  
  turma?: {
    id: number;
    nome: string;
    serie: string;
    valorMensalidade: number;
  };
  
  responsavelFinanceiro?: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
  };
  
  // Informações calculadas de mensalidade
  mensalidade?: {
    valorBase: number;
    valorCustomizado: number | null;
    percentualDesconto: number;
    valorDesconto: number;
    valorFinal: number;
    observacoes: string | null;
  };
  
  criadoEm: Date;
  atualizadoEm: Date;
}
