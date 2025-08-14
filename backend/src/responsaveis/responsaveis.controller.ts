import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ResponsaveisService } from './responsaveis.service';
import { CreateResponsavelDto, UpdateResponsavelDto, ResponsavelResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TipoUsuario } from '../entities/usuario.entity';

@Controller('responsaveis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResponsaveisController {
  constructor(private readonly responsaveisService: ResponsaveisService) {}

  @Post()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async create(@Body() createResponsavelDto: CreateResponsavelDto): Promise<ResponsavelResponseDto> {
    const responsavel = await this.responsaveisService.create(createResponsavelDto);
    return this.transformToResponse(responsavel);
  }

  @Get()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async findAll(@Query('ativos') ativos?: string): Promise<ResponsavelResponseDto[]> {
    let responsaveis;
    
    if (ativos === 'true') {
      responsaveis = await this.responsaveisService.findActives();
    } else {
      responsaveis = await this.responsaveisService.findAll();
    }

    return responsaveis.map(responsavel => this.transformToResponse(responsavel));
  }

  @Get('estatisticas')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async getStatistics() {
    return this.responsaveisService.getStatistics();
  }

  @Get(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponsavelResponseDto> {
    const responsavel = await this.responsaveisService.findOne(id);
    return this.transformToResponse(responsavel);
  }

  @Patch(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResponsavelDto: UpdateResponsavelDto
  ): Promise<ResponsavelResponseDto> {
    const responsavel = await this.responsaveisService.update(id, updateResponsavelDto);
    return this.transformToResponse(responsavel);
  }

  @Patch(':id/toggle-active')
  @Roles(TipoUsuario.ADMIN)
  async toggleActive(@Param('id', ParseIntPipe) id: number): Promise<ResponsavelResponseDto> {
    const responsavel = await this.responsaveisService.toggleActive(id);
    return this.transformToResponse(responsavel);
  }

  @Delete(':id')
  @Roles(TipoUsuario.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.responsaveisService.remove(id);
    return { message: 'Responsável financeiro removido com sucesso' };
  }

  private transformToResponse(responsavel: any): ResponsavelResponseDto {
    return {
      id: responsavel.id,
      nome: responsavel.nome,
      cpfCnpj: responsavel.cpfCnpj,
      email: responsavel.email,
      telefone: responsavel.telefone,
      endereco: responsavel.endereco,
      cidade: responsavel.cidade,
      estado: responsavel.estado,
      cep: responsavel.cep,
      inscricaoEstadual: responsavel.inscricaoEstadual,
      inscricaoMunicipal: responsavel.inscricaoMunicipal,
      razaoSocial: responsavel.razaoSocial,
      ativo: responsavel.ativo,
      quantidadeAlunos: responsavel.alunos ? responsavel.alunos.filter(aluno => aluno.ativo).length : 0,
      criadoEm: responsavel.criadoEm,
      atualizadoEm: responsavel.atualizadoEm,
    };
  }
}
