import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turma } from '../entities/turma.entity';
import { CreateTurmaDto, UpdateTurmaDto, TurmaResponseDto, TurnoEnum } from './dto';

@Injectable()
export class TurmasService {
  constructor(
    @InjectRepository(Turma)
    private turmaRepository: Repository<Turma>,
  ) {}

  async create(createTurmaDto: CreateTurmaDto): Promise<TurmaResponseDto> {
    // Verificar se já existe turma com mesmo nome, série, turno e ano
    const turmaExistente = await this.turmaRepository.findOne({
      where: {
        nome: createTurmaDto.nome,
        serie: createTurmaDto.serie,
        turno: createTurmaDto.turno,
        ano: createTurmaDto.ano,
      },
    });

    if (turmaExistente) {
      throw new ConflictException(
        'Já existe uma turma com este nome, série, turno e ano'
      );
    }

    const turma = this.turmaRepository.create(createTurmaDto);
    const turmaSalva = await this.turmaRepository.save(turma);

    return new TurmaResponseDto({
      id: turmaSalva.id,
      nome: turmaSalva.nome,
      serie: turmaSalva.serie,
      turno: turmaSalva.turno as TurnoEnum,
      ano: turmaSalva.ano,
      valorMensalidade: turmaSalva.valorMensalidade,
      ativa: turmaSalva.ativa,
      totalAlunos: 0, // Será calculado quando necessário
      criadoEm: turmaSalva.criadaEm,
      atualizadoEm: turmaSalva.atualizadaEm,
    });
  }

  async findAll(): Promise<TurmaResponseDto[]> {
    const turmas = await this.turmaRepository.find({
      relations: ['alunos'],
      order: {
        ano: 'DESC',
        serie: 'ASC',
        nome: 'ASC',
      },
    });

    return turmas.map(turma => new TurmaResponseDto({
      id: turma.id,
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno as TurnoEnum,
      ano: turma.ano,
      valorMensalidade: turma.valorMensalidade,
      ativa: turma.ativa,
      totalAlunos: turma.alunos?.length || 0,
      criadoEm: turma.criadaEm,
      atualizadoEm: turma.atualizadaEm,
    }));
  }

  async findOne(id: number): Promise<TurmaResponseDto> {
    const turma = await this.turmaRepository.findOne({
      where: { id },
      relations: ['alunos'],
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }

    return new TurmaResponseDto({
      id: turma.id,
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno as TurnoEnum,
      ano: turma.ano,
      valorMensalidade: turma.valorMensalidade,
      ativa: turma.ativa,
      totalAlunos: turma.alunos?.length || 0,
      criadoEm: turma.criadaEm,
      atualizadoEm: turma.atualizadaEm,
    });
  }

  async update(id: number, updateTurmaDto: UpdateTurmaDto): Promise<TurmaResponseDto> {
    const turma = await this.turmaRepository.findOne({
      where: { id },
      relations: ['alunos'],
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }

    // Se está atualizando nome, série, turno ou ano, verificar duplicata
    if (
      updateTurmaDto.nome ||
      updateTurmaDto.serie ||
      updateTurmaDto.turno ||
      updateTurmaDto.ano
    ) {
      const turmaExistente = await this.turmaRepository.findOne({
        where: {
          nome: updateTurmaDto.nome || turma.nome,
          serie: updateTurmaDto.serie || turma.serie,
          turno: updateTurmaDto.turno || turma.turno,
          ano: updateTurmaDto.ano || turma.ano,
        },
      });

      if (turmaExistente && turmaExistente.id !== id) {
        throw new ConflictException(
          'Já existe uma turma com este nome, série, turno e ano'
        );
      }
    }

    // Atualizar turma
    Object.assign(turma, updateTurmaDto);
    const turmaAtualizada = await this.turmaRepository.save(turma);

    return new TurmaResponseDto({
      id: turmaAtualizada.id,
      nome: turmaAtualizada.nome,
      serie: turmaAtualizada.serie,
      turno: turmaAtualizada.turno as TurnoEnum,
      ano: turmaAtualizada.ano,
      valorMensalidade: turmaAtualizada.valorMensalidade,
      ativa: turmaAtualizada.ativa,
      totalAlunos: turmaAtualizada.alunos?.length || 0,
      criadoEm: turmaAtualizada.criadaEm,
      atualizadoEm: turmaAtualizada.atualizadaEm,
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const turma = await this.turmaRepository.findOne({
      where: { id },
      relations: ['alunos'],
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }

    // Verificar se turma tem alunos associados
    if (turma.alunos && turma.alunos.length > 0) {
      throw new ConflictException(
        'Não é possível excluir turma que possui alunos cadastrados'
      );
    }

    await this.turmaRepository.remove(turma);

    return {
      message: 'Turma excluída com sucesso'
    };
  }

  async toggleActive(id: number): Promise<TurmaResponseDto> {
    const turma = await this.turmaRepository.findOne({
      where: { id },
      relations: ['alunos'],
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }

    turma.ativa = !turma.ativa;
    const turmaAtualizada = await this.turmaRepository.save(turma);

    return new TurmaResponseDto({
      id: turmaAtualizada.id,
      nome: turmaAtualizada.nome,
      serie: turmaAtualizada.serie,
      turno: turmaAtualizada.turno as TurnoEnum,
      ano: turmaAtualizada.ano,
      valorMensalidade: turmaAtualizada.valorMensalidade,
      ativa: turmaAtualizada.ativa,
      totalAlunos: turmaAtualizada.alunos?.length || 0,
      criadoEm: turmaAtualizada.criadaEm,
      atualizadoEm: turmaAtualizada.atualizadaEm,
    });
  }

  async findByAno(ano: number): Promise<TurmaResponseDto[]> {
    const turmas = await this.turmaRepository.find({
      where: { ano },
      relations: ['alunos'],
      order: {
        serie: 'ASC',
        nome: 'ASC',
      },
    });

    return turmas.map(turma => new TurmaResponseDto({
      id: turma.id,
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno as TurnoEnum,
      ano: turma.ano,
      valorMensalidade: turma.valorMensalidade,
      ativa: turma.ativa,
      totalAlunos: turma.alunos?.length || 0,
      criadoEm: turma.criadaEm,
      atualizadoEm: turma.atualizadaEm,
    }));
  }
}
