import { IsNotEmpty, IsString, IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum TurnoEnum {
  MATUTINO = 'matutino',
  VESPERTINO = 'vespertino',
  NOTURNO = 'noturno',
  INTEGRAL = 'integral'
}

export class CreateTurmaDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser um texto' })
  nome: string;

  @IsNotEmpty({ message: 'Série é obrigatória' })
  @IsString({ message: 'Série deve ser um texto' })
  serie: string;

  @IsNotEmpty({ message: 'Turno é obrigatório' })
  @IsEnum(TurnoEnum, { message: 'Turno deve ser: matutino, vespertino, noturno ou integral' })
  turno: TurnoEnum;

  @IsNotEmpty({ message: 'Ano é obrigatório' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Ano deve ser um número' })
  @Min(2020, { message: 'Ano deve ser maior que 2020' })
  @Max(2030, { message: 'Ano deve ser menor que 2030' })
  ano: number;

  @IsNotEmpty({ message: 'Valor da mensalidade é obrigatório' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser um número com até 2 casas decimais' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  valorMensalidade: number;

  @Type(() => Boolean)
  @IsBoolean({ message: 'Ativa deve ser verdadeiro ou falso' })
  ativa?: boolean = true;
}
