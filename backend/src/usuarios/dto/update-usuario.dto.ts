import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsEnum, IsEmail, IsString, MinLength } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';
import { TipoUsuario } from '../../entities/usuario.entity';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  senha?: string;

  @IsOptional()
  @IsEnum(TipoUsuario, { message: 'Tipo deve ser admin ou operador' })
  tipo?: TipoUsuario;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser verdadeiro ou falso' })
  ativo?: boolean;
}
