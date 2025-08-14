import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuarioResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, GetUser } from '../auth/decorators';
import { TipoUsuario, Usuario } from '../entities/usuario.entity';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN) // Apenas administradores podem acessar
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @GetUser() user: Usuario,
  ): Promise<UsuarioResponseDto> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  async findAll(@GetUser() user: Usuario): Promise<UsuarioResponseDto[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuario,
  ): Promise<UsuarioResponseDto> {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @GetUser() user: Usuario,
  ): Promise<UsuarioResponseDto> {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuario,
  ): Promise<void> {
    return this.usuariosService.remove(id);
  }

  @Patch(':id/toggle-active')
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuario,
  ): Promise<UsuarioResponseDto> {
    return this.usuariosService.toggleActive(id);
  }
}
