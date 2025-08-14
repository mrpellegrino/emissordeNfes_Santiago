import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAlunoDto } from './create-aluno.dto';

export class ImportAlunosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAlunoDto)
  alunos: CreateAlunoDto[];
}

export class ImportResultDto {
  sucesso: number;
  erros: number;
  detalhes: ImportDetailDto[];
}

export class ImportDetailDto {
  linha: number;
  aluno?: any;
  erro?: string;
  status: 'sucesso' | 'erro';
}
