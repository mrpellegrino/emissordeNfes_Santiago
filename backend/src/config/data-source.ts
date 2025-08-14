import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { 
  Usuario, 
  Turma, 
  Aluno, 
  ResponsavelFinanceiro, 
  Mensalidade, 
  FilaEmissao 
} from '../entities';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'localhost',
  port: parseInt(configService.get('DATABASE_PORT') || '5432'),
  username: configService.get('DATABASE_USERNAME') || 'postgres',
  password: configService.get('DATABASE_PASSWORD') || 'senha',
  database: configService.get('DATABASE_NAME') || 'nfse_sistema',
  entities: [
    Usuario,
    Turma,
    Aluno,
    ResponsavelFinanceiro,
    Mensalidade,
    FilaEmissao
  ],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development', // true apenas em desenvolvimento
  logging: process.env.NODE_ENV === 'development',
});

// Função para criar configuração do TypeORM no NestJS
export const createTypeOrmConfig = (configService: ConfigService) => ({
  type: 'postgres' as const,
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'senha'),
  database: configService.get('DATABASE_NAME', 'nfse_sistema'),
  entities: [
    Usuario,
    Turma,
    Aluno,
    ResponsavelFinanceiro,
    Mensalidade,
    FilaEmissao
  ],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
});
