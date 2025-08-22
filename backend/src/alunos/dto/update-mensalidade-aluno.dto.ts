import { IsNumber, IsOptional, IsString, Min, Length } from 'class-validator';

export class UpdateMensalidadeAlunoDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorMensalidadeCustomizado?: number; // Se menor que o valor da turma, percentualDesconto e valorDesconto são calculados automaticamente

  @IsString()
  @IsOptional()
  @Length(1, 500)
  observacoesMensalidade?: string;
}
