import { PartialType } from '@nestjs/mapped-types';
import { CreateTurmaDto } from './create-turma.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTurmaDto extends PartialType(CreateTurmaDto) {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Ativa deve ser verdadeiro ou falso' })
  ativa?: boolean;
}
