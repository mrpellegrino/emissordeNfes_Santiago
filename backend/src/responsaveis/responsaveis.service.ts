import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponsavelFinanceiro } from '../entities/responsavel-financeiro.entity';
import { CreateResponsavelDto, UpdateResponsavelDto } from './dto';

@Injectable()
export class ResponsaveisService {
  constructor(
    @InjectRepository(ResponsavelFinanceiro)
    private responsavelRepository: Repository<ResponsavelFinanceiro>,
  ) {}

  async create(createResponsavelDto: CreateResponsavelDto): Promise<ResponsavelFinanceiro> {
    // Verificar se CPF/CNPJ já existe
    const existingResponsavel = await this.responsavelRepository.findOne({
      where: { cpfCnpj: createResponsavelDto.cpfCnpj }
    });

    if (existingResponsavel) {
      throw new ConflictException('CPF/CNPJ já está cadastrado');
    }

    // Verificar se email já existe
    const existingEmail = await this.responsavelRepository.findOne({
      where: { email: createResponsavelDto.email }
    });

    if (existingEmail) {
      throw new ConflictException('Email já está cadastrado');
    }

    const responsavel = this.responsavelRepository.create(createResponsavelDto);
    return this.responsavelRepository.save(responsavel);
  }

  async findAll(): Promise<ResponsavelFinanceiro[]> {
    return this.responsavelRepository.find({
      relations: ['alunos'],
      order: { nome: 'ASC' }
    });
  }

  async findActives(): Promise<ResponsavelFinanceiro[]> {
    return this.responsavelRepository.find({
      where: { ativo: true },
      relations: ['alunos'],
      order: { nome: 'ASC' }
    });
  }

  async findOne(id: number): Promise<ResponsavelFinanceiro> {
    const responsavel = await this.responsavelRepository.findOne({
      where: { id },
      relations: ['alunos']
    });

    if (!responsavel) {
      throw new NotFoundException('Responsável financeiro não encontrado');
    }

    return responsavel;
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<ResponsavelFinanceiro | null> {
    return this.responsavelRepository.findOne({
      where: { cpfCnpj }
    });
  }

  async update(id: number, updateResponsavelDto: UpdateResponsavelDto): Promise<ResponsavelFinanceiro> {
    const responsavel = await this.findOne(id);

    // Se está mudando o CPF/CNPJ, verificar se o novo já existe
    if (updateResponsavelDto.cpfCnpj && updateResponsavelDto.cpfCnpj !== responsavel.cpfCnpj) {
      const existingCpfCnpj = await this.responsavelRepository.findOne({
        where: { cpfCnpj: updateResponsavelDto.cpfCnpj }
      });
      if (existingCpfCnpj) {
        throw new ConflictException('CPF/CNPJ já está cadastrado');
      }
    }

    // Se está mudando o email, verificar se o novo já existe
    if (updateResponsavelDto.email && updateResponsavelDto.email !== responsavel.email) {
      const existingEmail = await this.responsavelRepository.findOne({
        where: { email: updateResponsavelDto.email }
      });
      if (existingEmail) {
        throw new ConflictException('Email já está cadastrado');
      }
    }

    Object.assign(responsavel, updateResponsavelDto);
    return this.responsavelRepository.save(responsavel);
  }

  async toggleActive(id: number): Promise<ResponsavelFinanceiro> {
    const responsavel = await this.findOne(id);

    // Verificar se pode desativar (não tem alunos ativos)
    if (responsavel.ativo && responsavel.alunos && responsavel.alunos.length > 0) {
      const alunosAtivos = responsavel.alunos.filter(aluno => aluno.ativo);
      if (alunosAtivos.length > 0) {
        throw new ConflictException(
          `Não é possível desativar o responsável. Existem ${alunosAtivos.length} aluno(s) ativo(s) vinculado(s)`
        );
      }
    }

    responsavel.ativo = !responsavel.ativo;
    return this.responsavelRepository.save(responsavel);
  }

  async remove(id: number): Promise<void> {
    const responsavel = await this.findOne(id);

    // Verificar se pode remover (não tem alunos)
    if (responsavel.alunos && responsavel.alunos.length > 0) {
      throw new ConflictException(
        `Não é possível remover o responsável. Existem ${responsavel.alunos.length} aluno(s) vinculado(s)`
      );
    }

    await this.responsavelRepository.remove(responsavel);
  }

  async getStatistics(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    comAlunos: number;
    semAlunos: number;
  }> {
    const [total, ativos] = await Promise.all([
      this.responsavelRepository.count(),
      this.responsavelRepository.count({ where: { ativo: true } })
    ]);

    const responsaveisComAlunos = await this.responsavelRepository
      .createQueryBuilder('responsavel')
      .innerJoin('responsavel.alunos', 'aluno')
      .where('aluno.ativo = :ativo', { ativo: true })
      .getCount();

    return {
      total,
      ativos,
      inativos: total - ativos,
      comAlunos: responsaveisComAlunos,
      semAlunos: total - responsaveisComAlunos
    };
  }
}
