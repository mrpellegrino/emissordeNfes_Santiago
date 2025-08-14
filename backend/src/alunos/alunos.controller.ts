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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto, UpdateAlunoDto, AlunoResponseDto, ImportResultDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TipoUsuario } from '../entities/usuario.entity';

@Controller('alunos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async create(@Body() createAlunoDto: CreateAlunoDto): Promise<AlunoResponseDto> {
    const aluno = await this.alunosService.create(createAlunoDto);
    return this.transformToResponse(aluno);
  }

  @Get()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async findAll(@Query('turmaId') turmaId?: string): Promise<AlunoResponseDto[]> {
    let alunos;
    
    if (turmaId) {
      const id = parseInt(turmaId);
      if (isNaN(id)) {
        throw new BadRequestException('ID da turma deve ser um número');
      }
      alunos = await this.alunosService.findByTurma(id);
    } else {
      alunos = await this.alunosService.findAll();
    }

    return alunos.map(aluno => this.transformToResponse(aluno));
  }

  @Get(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AlunoResponseDto> {
    const aluno = await this.alunosService.findOne(id);
    return this.transformToResponse(aluno);
  }

  @Patch(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlunoDto: UpdateAlunoDto,
  ): Promise<AlunoResponseDto> {
    const aluno = await this.alunosService.update(id, updateAlunoDto);
    return this.transformToResponse(aluno);
  }

  @Delete(':id')
  @Roles(TipoUsuario.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.alunosService.remove(id);
    return { message: 'Aluno removido com sucesso' };
  }

  @Patch(':id/toggle-active')
  @Roles(TipoUsuario.ADMIN)
  async toggleActive(@Param('id', ParseIntPipe) id: number): Promise<AlunoResponseDto> {
    const aluno = await this.alunosService.toggleActive(id);
    return this.transformToResponse(aluno);
  }

  @Post('importar')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  @UseInterceptors(FileInterceptor('file'))
  async importFromExcel(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImportResultDto> {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    // Verificar se é um arquivo Excel
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Arquivo deve ser um Excel (.xls ou .xlsx)');
    }

    return this.alunosService.importFromExcel(file);
  }

  private transformToResponse(aluno: any): AlunoResponseDto {
    return {
      id: aluno.id,
      nome: aluno.nome,
      matricula: aluno.matricula,
      dataNascimento: aluno.dataNascimento,
      cpf: aluno.cpf,
      rg: aluno.rg,
      endereco: aluno.endereco,
      telefone: aluno.telefone,
      email: aluno.email,
      ativo: aluno.ativo,
      turma: aluno.turma ? {
        id: aluno.turma.id,
        nome: aluno.turma.nome,
        serie: aluno.turma.serie,
      } : undefined,
      responsavelFinanceiro: aluno.responsavelFinanceiro ? {
        id: aluno.responsavelFinanceiro.id,
        nome: aluno.responsavelFinanceiro.nome,
        email: aluno.responsavelFinanceiro.email,
        telefone: aluno.responsavelFinanceiro.telefone,
      } : undefined,
      criadoEm: aluno.criadoEm,
      atualizadoEm: aluno.atualizadoEm,
    };
  }
}
