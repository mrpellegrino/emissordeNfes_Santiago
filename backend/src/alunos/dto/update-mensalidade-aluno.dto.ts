import { IsNumber, IsOptional, IsString, Min, Max, Length } from 'class-validator';

export class UpdateMensalidadeAlunoDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorMensalidadeCustomizado?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  percentualDesconto?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  valorDesconto?: number;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  observacoesMensalidade?: string;
}
