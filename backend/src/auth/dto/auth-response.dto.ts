import { TipoUsuario } from '../../entities/usuario.entity';

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    nome: string;
    tipo: TipoUsuario;
    ativo: boolean;
  };
}
