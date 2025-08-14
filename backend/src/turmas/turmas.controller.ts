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
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { CreateTurmaDto, UpdateTurmaDto, TurmaResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { TipoUsuario } from '../entities/usuario.entity';

@Controller('turmas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Post()
  @Roles(TipoUsuario.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTurmaDto: CreateTurmaDto): Promise<TurmaResponseDto> {
    return this.turmasService.create(createTurmaDto);
  }

  @Get()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async findAll(@Query('ano') ano?: string): Promise<TurmaResponseDto[]> {
    if (ano) {
      const anoNumber = parseInt(ano, 10);
      if (isNaN(anoNumber)) {
        throw new Error('Ano deve ser um número válido');
      }
      return this.turmasService.findByAno(anoNumber);
    }
    return this.turmasService.findAll();
  }

  @Get(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.OPERADOR)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TurmaResponseDto> {
    return this.turmasService.findOne(id);
  }

  @Patch(':id')
  @Roles(TipoUsuario.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurmaDto: UpdateTurmaDto,
  ): Promise<TurmaResponseDto> {
    return this.turmasService.update(id, updateTurmaDto);
  }

  @Delete(':id')
  @Roles(TipoUsuario.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.turmasService.remove(id);
  }

  @Patch(':id/toggle-active')
  @Roles(TipoUsuario.ADMIN)
  async toggleActive(@Param('id', ParseIntPipe) id: number): Promise<TurmaResponseDto> {
    return this.turmasService.toggleActive(id);
  }
}
