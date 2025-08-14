import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { Aluno } from '../entities/aluno.entity';
import { Turma } from '../entities/turma.entity';
import { ResponsavelFinanceiro } from '../entities/responsavel-financeiro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Aluno,
      Turma,
      ResponsavelFinanceiro,
    ]),
  ],
  controllers: [AlunosController],
  providers: [AlunosService],
  exports: [AlunosService],
})
export class AlunosModule {}
