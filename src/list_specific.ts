import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Usuario } from './entities/Usuario';
import { Empresa } from './entities/Empresa';
import { Departamento } from './entities/Departamento';
import { Questionario } from './entities/Questionario';
import { Questao } from './entities/Questao';
import { Aviso } from './entities/Aviso';
import { RespostaQuestionario } from './entities/RespostaQuestionario';
import { Reclamacao } from './entities/Reclamacao';
import { Denuncia } from './entities/Denuncia';
import { Arquivo } from './entities/Arquivo';
import { OpcaoResposta } from './entities/OpcaoResposta';

dotenv.config();

const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'avaliacao_organizacional',
    synchronize: false,
    logging: false,
    entities: [Usuario, Empresa, Departamento, Questionario, Questao, Aviso, RespostaQuestionario, Reclamacao, Denuncia, Arquivo, OpcaoResposta],
});

async function listSpecific() {
    try {
        await ds.initialize();
        const empresaRepo = ds.getRepository(Empresa);
        const usuarioRepo = ds.getRepository(Usuario);

        console.log('--- BUSCANDO EMPRESAS RECENTES ---');
        const empresas = await empresaRepo.find({ order: { criado_em: 'DESC' }, take: 5 });
        empresas.forEach(e => console.log(`E: ${e.nome} | ID: ${e.id}`));

        console.log('\n--- BUSCANDO USUÁRIOS RECENTES ---');
        const usuarios = await usuarioRepo.find({ order: { criado_em: 'DESC' }, take: 5 });
        usuarios.forEach(u => console.log(`U: ${u.email} | Tipo: ${u.tipo} | EmpresaID: ${u.empresa_id}`));

        console.log('\n--- BUSCANDO locadora@gmail.com ---');
        const user = await usuarioRepo.findOne({ where: { email: 'locadora@gmail.com' } });
        console.log(user ? `ACHOU: ${user.email} (Empresa: ${user.empresa_id})` : 'NÃO ACHOU locadora@gmail.com');

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

listSpecific();
