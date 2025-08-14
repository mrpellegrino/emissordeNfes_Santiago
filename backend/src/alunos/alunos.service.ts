import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Aluno } from '../entities/aluno.entity';
import { Turma } from '../entities/turma.entity';
import { ResponsavelFinanceiro } from '../entities/responsavel-financeiro.entity';
import { CreateAlunoDto, UpdateAlunoDto, ImportResultDto, ImportDetailDto } from './dto';

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(Aluno)
    private alunoRepository: Repository<Aluno>,
    @InjectRepository(Turma)
    private turmaRepository: Repository<Turma>,
    @InjectRepository(ResponsavelFinanceiro)
    private responsavelRepository: Repository<ResponsavelFinanceiro>,
  ) {}

  async create(createAlunoDto: CreateAlunoDto): Promise<Aluno> {
    // Verificar se a turma existe
    const turma = await this.turmaRepository.findOne({
      where: { id: createAlunoDto.turmaId, ativa: true }
    });
    if (!turma) {
      throw new NotFoundException('Turma não encontrada ou inativa');
    }

    // Verificar se o responsável financeiro existe
    const responsavel = await this.responsavelRepository.findOne({
      where: { id: createAlunoDto.responsavelFinanceiroId, ativo: true }
    });
    if (!responsavel) {
      throw new NotFoundException('Responsável financeiro não encontrado ou inativo');
    }

    // Verificar se a matrícula já existe
    const existingAluno = await this.alunoRepository.findOne({
      where: { matricula: createAlunoDto.matricula }
    });
    if (existingAluno) {
      throw new ConflictException('Matrícula já existe');
    }

    // Criar o aluno
    const aluno = this.alunoRepository.create({
      ...createAlunoDto,
      turma,
      responsavelFinanceiro: responsavel,
    });

    return this.alunoRepository.save(aluno);
  }

  async findAll(): Promise<Aluno[]> {
    return this.alunoRepository.find({
      relations: ['turma', 'responsavelFinanceiro'],
      order: { nome: 'ASC' }
    });
  }

  async findByTurma(turmaId: number): Promise<Aluno[]> {
    return this.alunoRepository.find({
      where: { turma: { id: turmaId } },
      relations: ['turma', 'responsavelFinanceiro'],
      order: { nome: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Aluno> {
    const aluno = await this.alunoRepository.findOne({
      where: { id },
      relations: ['turma', 'responsavelFinanceiro']
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    return aluno;
  }

  async update(id: number, updateAlunoDto: UpdateAlunoDto): Promise<Aluno> {
    const aluno = await this.findOne(id);

    // Se está mudando a turma, verificar se ela existe
    if (updateAlunoDto.turmaId && updateAlunoDto.turmaId !== aluno.turma.id) {
      const turma = await this.turmaRepository.findOne({
        where: { id: updateAlunoDto.turmaId, ativa: true }
      });
      if (!turma) {
        throw new NotFoundException('Turma não encontrada ou inativa');
      }
      aluno.turma = turma;
    }

    // Se está mudando o responsável, verificar se ele existe
    if (updateAlunoDto.responsavelFinanceiroId && 
        updateAlunoDto.responsavelFinanceiroId !== aluno.responsavelFinanceiro.id) {
      const responsavel = await this.responsavelRepository.findOne({
        where: { id: updateAlunoDto.responsavelFinanceiroId, ativo: true }
      });
      if (!responsavel) {
        throw new NotFoundException('Responsável financeiro não encontrado ou inativo');
      }
      aluno.responsavelFinanceiro = responsavel;
    }

    // Se está mudando a matrícula, verificar se não existe duplicata
    if (updateAlunoDto.matricula && updateAlunoDto.matricula !== aluno.matricula) {
      const existingAluno = await this.alunoRepository.findOne({
        where: { matricula: updateAlunoDto.matricula }
      });
      if (existingAluno && existingAluno.id !== id) {
        throw new ConflictException('Matrícula já existe');
      }
    }

    // Atualizar os campos
    Object.assign(aluno, updateAlunoDto);

    return this.alunoRepository.save(aluno);
  }

  async remove(id: number): Promise<void> {
    const aluno = await this.findOne(id);
    await this.alunoRepository.remove(aluno);
  }

  async toggleActive(id: number): Promise<Aluno> {
    const aluno = await this.findOne(id);
    aluno.ativo = !aluno.ativo;
    return this.alunoRepository.save(aluno);
  }

  async importFromExcel(file: Express.Multer.File): Promise<ImportResultDto> {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    try {
      // Ler o arquivo Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const result: ImportResultDto = {
        sucesso: 0,
        erros: 0,
        detalhes: []
      };

      // Processar cada linha
      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any;
        const linha = i + 2; // +2 porque começa na linha 2 do Excel (linha 1 é cabeçalho)

        try {
          // Mapear dados da planilha para DTO
          const alunoDto: CreateAlunoDto = {
            nome: row['Nome'] || row['nome'],
            matricula: row['Matricula'] || row['matricula'],
            dataNascimento: this.parseDate(row['Data Nascimento'] || row['dataNascimento']),
            cpf: row['CPF'] || row['cpf'],
            rg: row['RG'] || row['rg'],
            endereco: row['Endereco'] || row['endereco'],
            telefone: row['Telefone'] || row['telefone'],
            email: row['Email'] || row['email'],
            turmaId: parseInt(row['Turma ID'] || row['turmaId']),
            responsavelFinanceiroId: parseInt(row['Responsavel ID'] || row['responsavelId'])
          };

          // Validações básicas
          if (!alunoDto.nome || !alunoDto.matricula || !alunoDto.turmaId || !alunoDto.responsavelFinanceiroId) {
            throw new Error('Campos obrigatórios não preenchidos');
          }

          // Tentar criar o aluno
          const aluno = await this.create(alunoDto);
          
          result.sucesso++;
          result.detalhes.push({
            linha,
            aluno: { id: aluno.id, nome: aluno.nome, matricula: aluno.matricula },
            status: 'sucesso'
          });

        } catch (error) {
          result.erros++;
          result.detalhes.push({
            linha,
            erro: error.message,
            status: 'erro'
          });
        }
      }

      return result;

    } catch (error) {
      throw new BadRequestException(`Erro ao processar arquivo: ${error.message}`);
    }
  }

  private parseDate(dateValue: any): string {
    if (!dateValue) return '';
    
    // Se já é uma string no formato correto
    if (typeof dateValue === 'string') {
      return dateValue;
    }
    
    // Se é um número (data serial do Excel)
    if (typeof dateValue === 'number') {
      const date = XLSX.SSF.parse_date_code(dateValue);
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
    
    // Se é um objeto Date
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    
    return '';
  }
}
