import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { Usuario } from './entities/Usuario';
import { Empresa } from './entities/Empresa';
import { TipoUsuario } from './entities/Usuario';

async function seed() {
  await AppDataSource.initialize();
  
  const empresaRepo = AppDataSource.getRepository(Empresa);
  const usuarioRepo = AppDataSource.getRepository(Usuario);
  
  // Criar empresa
  const empresa = empresaRepo.create({
    nome: 'Minha Empresa',
    cnpj: '00.000.000/0001-00',
    email: 'contato@empresa.com'
  });
  await empresaRepo.save(empresa);
  
  // Criar usuário admin
  const usuario = usuarioRepo.create({
    nome: 'Administrador',
    email: 'admin@empresa.com',
    senha: '123',
    tipo: TipoUsuario.ADMIN,
    empresa_id: empresa.id
  });
  await usuarioRepo.save(usuario);
  
  console.log('✅ Dados iniciais criados!');
  console.log('📧 Email: admin@empresa.com');
  console.log('🔑 Senha: 123');
  
  process.exit(0);
}

seed().catch(console.error);