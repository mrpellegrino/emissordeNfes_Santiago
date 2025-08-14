import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './config/data-source';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TurmasModule } from './turmas/turmas.module';
import { AlunosModule } from './alunos/alunos.module';
import { ResponsaveisModule } from './responsaveis/responsaveis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => createTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UsuariosModule,
    TurmasModule,
    AlunosModule,
    ResponsaveisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
