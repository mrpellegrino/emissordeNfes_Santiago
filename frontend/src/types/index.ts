// Tipos para autenticação
export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'operador';
  ativo: boolean;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Tipos para entidades do sistema
export interface Turma {
  id: string;
  nome: string;
  ano: number;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResponsavelFinanceiro {
  id: string;
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
  responsavelId: string;
  ativo: boolean;
  turma?: Turma;
  responsavel?: ResponsavelFinanceiro;
  createdAt: string;
  updatedAt: string;
}

export interface Mensalidade {
  id: string;
  alunoId: string;
  mes: number;
  ano: number;
  valor: number;
  statusPagamento: 'nao_pago' | 'pago' | 'nota_emitida' | 'erro_emissao';
  numeroNfse?: string;
  dataEmissao?: string;
  dataPagamento?: string;
  aluno?: Aluno;
  createdAt: string;
  updatedAt: string;
}

// Tipos para API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para formulários
export interface CreateTurmaDto {
  nome: string;
  ano: number;
}

export interface CreateAlunoDto {
  nome: string;
  turmaId: string;
  responsavel: {
    nome: string;
    cpfCnpj: string;
    endereco: string;
    telefone: string;
    email: string;
  };
}

export interface ImportAlunosDto {
  file: File;
}
