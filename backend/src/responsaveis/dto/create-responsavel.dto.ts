import { IsString, IsEmail, IsOptional, IsNotEmpty, Length } from 'class-validator';

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
  @IsOptional()
  @Length(1, 200)
  endereco?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  cidade?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2)
  estado?: string;

  @IsString()
  @IsOptional()
  @Length(8, 9)
  cep?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  inscricaoEstadual?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  inscricaoMunicipal?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  razaoSocial?: string;
}
