import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsNotEmpty, Length, Min, Max } from 'class-validator';

export class CreateAlunoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  matricula: string;

  @IsDateString()
  dataNascimento: string;

  @IsString()
  @IsOptional()
  @Length(11, 14)
  cpf?: string;

  @IsString()
  @IsOptional()
  @Length(5, 20)
  rg?: string;

  @IsString()
  @IsOptional()
  @Length(1, 200)
  endereco?: string;

  @IsString()
  @IsOptional()
  @Length(8, 20)
  telefone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsNotEmpty()
  turmaId: number;

  @IsNumber()
  @IsNotEmpty()
  responsavelFinanceiroId: number;

  // Campos de mensalidade personalizada
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorMensalidadeCustomizado?: number; // Se não enviado, herda o valor da turma. Se enviado, os descontos são calculados automaticamente

  @IsString()
  @IsOptional()
  @Length(1, 500)
  observacoesMensalidade?: string;
}
