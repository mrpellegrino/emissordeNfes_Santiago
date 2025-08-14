import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsNotEmpty } from 'class-validator';
import { TipoUsuario } from '../../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;

  @IsEnum(TipoUsuario, { message: 'Tipo deve ser admin ou operador' })
  @IsOptional()
  tipo?: TipoUsuario = TipoUsuario.OPERADOR;

  @IsOptional()
  ativo?: boolean = true;
}
