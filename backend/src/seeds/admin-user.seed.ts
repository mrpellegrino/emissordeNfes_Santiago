import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, TipoUsuario } from '../entities';

export async function seedUsuarioAdmin(dataSource: DataSource) {
  const usuarioRepository = dataSource.getRepository(Usuario);
  
  // Verificar se já existe um admin
  const adminExiste = await usuarioRepository.findOne({
    where: { email: 'admin@santiago.com' }
  });

  if (!adminExiste) {
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    const admin = usuarioRepository.create({
      email: 'admin@santiago.com',
      nome: 'Administrador',
      senha: senhaHash,
      tipo: TipoUsuario.ADMIN,
      ativo: true
    });

    await usuarioRepository.save(admin);
    console.log('✅ Usuário administrador criado: admin@santiago.com / admin123');
  } else {
    console.log('✅ Usuário administrador já existe');
  }
}

// Script para executar o seed
async function runSeed() {
  const { default: dataSource } = await import('../config/data-source');
  
  try {
    await dataSource.initialize();
    await seedUsuarioAdmin(dataSource);
    await dataSource.destroy();
    console.log('🌱 Seed executado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  runSeed();
}
