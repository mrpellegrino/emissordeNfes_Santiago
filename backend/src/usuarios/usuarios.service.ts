import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, TipoUsuario } from '../entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuarioResponseDto } from './dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    const { email, senha, ...dadosUsuario } = createUsuarioDto;

    // Verificar se email já existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email }
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUsuario = this.usuarioRepository.create({
      ...dadosUsuario,
      email,
      senha: senhaHash,
    });

    const usuarioSalvo = await this.usuarioRepository.save(novoUsuario);

    // Retornar sem a senha
    return this.toResponseDto(usuarioSalvo);
  }

  async findAll(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepository.find({
      order: { criadoEm: 'DESC' }
    });

    return usuarios.map(usuario => this.toResponseDto(usuario));
  }

  async findOne(id: number): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.toResponseDto(usuario);
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se está atualizando email, verificar se não existe outro usuário com esse email
    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const usuarioComEmail = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email }
      });

      if (usuarioComEmail) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }
    }

    // Se está atualizando senha, fazer hash
    let dadosAtualizacao = { ...updateUsuarioDto };
    if (updateUsuarioDto.senha) {
      const senhaHash = await bcrypt.hash(updateUsuarioDto.senha, 10);
      dadosAtualizacao = { ...dadosAtualizacao, senha: senhaHash };
    }

    // Atualizar usuário
    await this.usuarioRepository.update(id, dadosAtualizacao);

    // Buscar usuário atualizado
    const usuarioAtualizado = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuarioAtualizado) {
      throw new NotFoundException('Erro ao buscar usuário atualizado');
    }

    return this.toResponseDto(usuarioAtualizado);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se não é o último admin
    if (usuario.tipo === TipoUsuario.ADMIN) {
      const totalAdmins = await this.usuarioRepository.count({
        where: { tipo: TipoUsuario.ADMIN, ativo: true }
      });

      if (totalAdmins <= 1) {
        throw new BadRequestException('Não é possível remover o último administrador ativo');
      }
    }

    await this.usuarioRepository.remove(usuario);
  }

  async toggleActive(id: number): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se está desativando um admin, verificar se não é o último
    if (usuario.tipo === TipoUsuario.ADMIN && usuario.ativo) {
      const totalAdminsAtivos = await this.usuarioRepository.count({
        where: { tipo: TipoUsuario.ADMIN, ativo: true }
      });

      if (totalAdminsAtivos <= 1) {
        throw new BadRequestException('Não é possível desativar o último administrador ativo');
      }
    }

    usuario.ativo = !usuario.ativo;
    const usuarioAtualizado = await this.usuarioRepository.save(usuario);

    return this.toResponseDto(usuarioAtualizado);
  }

  private toResponseDto(usuario: Usuario): UsuarioResponseDto {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha as UsuarioResponseDto;
  }
}
