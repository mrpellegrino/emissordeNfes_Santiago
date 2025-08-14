import { TipoUsuario } from '../../entities/usuario.entity';

export class UsuarioResponseDto {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}
