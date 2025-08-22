import { IsString, IsEmail, IsOptional, IsNotEmpty, Length, IsNumber, IsIn } from 'class-validator';

export class CreateResponsavelDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 18)
  cpfCnpj: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  telefone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  endereco: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  cidade: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  estado: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 9)
  cep: string;

  @IsNumber()
  @IsNotEmpty()
  @IsIn([1, 2, 3], { message: 'tipoPessoa deve ser 1 (Pessoa Física), 2 (Pessoa Jurídica) ou 3 (Estrangeiro)' })
  tipoPessoa: number;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  inscricaoEstadual?: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  inscricaoMunicipal?: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  razaoSocial?: string;
}
