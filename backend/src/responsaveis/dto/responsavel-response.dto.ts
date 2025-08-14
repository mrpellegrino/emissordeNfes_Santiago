export class ResponsavelResponseDto {
  id: number;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  razaoSocial?: string;
  ativo: boolean;
  quantidadeAlunos?: number;
  criadoEm: Date;
  atualizadoEm: Date;
}
