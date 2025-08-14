import { PartialType } from '@nestjs/mapped-types';
import { CreateAlunoDto } from './create-aluno.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAlunoDto extends PartialType(CreateAlunoDto) {
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
