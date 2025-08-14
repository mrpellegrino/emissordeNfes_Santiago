import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsaveisService } from './responsaveis.service';
import { ResponsaveisController } from './responsaveis.controller';
import { ResponsavelFinanceiro } from '../entities/responsavel-financeiro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResponsavelFinanceiro])],
  controllers: [ResponsaveisController],
  providers: [ResponsaveisService],
  exports: [ResponsaveisService],
})
export class ResponsaveisModule {}
