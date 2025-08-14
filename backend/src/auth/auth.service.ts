import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto, AuthResponseDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, senha } = loginDto;

    // Buscar usuário pelo email
    const user = await this.usuarioRepository.findOne({
      where: { email }
    });

    // Verificar se usuário existe e está ativo
    if (!user || !user.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tipo: user.tipo,
    };

    const access_token = this.jwtService.sign(payload);

    // Retornar resposta sem a senha
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        tipo: user.tipo,
        ativo: user.ativo,
      },
    };
  }

  async validateUser(email: string, senha: string): Promise<any> {
    const user = await this.usuarioRepository.findOne({
      where: { email }
    });

    if (user && await bcrypt.compare(senha, user.senha)) {
      const { senha: _, ...result } = user;
      return result;
    }
    return null;
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { id, ativo: true }
    });
  }
}
