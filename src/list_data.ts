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

async function listData() {
    try {
        await ds.initialize();
        const empresaRepo = ds.getRepository(Empresa);
        const usuarioRepo = ds.getRepository(Usuario);

        const empresas = await empresaRepo.find();
        console.log('--- EMPRESAS ---');
        empresas.forEach(e => console.log(`- ${e.nome} | ID: ${e.id} | CNPJ: ${e.cnpj}`));

        const usuarios = await usuarioRepo.find();
        console.log('\n--- USUÁRIOS ---');
        usuarios.forEach(u => console.log(`- ${u.nome} | Email: ${u.email} | Tipo: ${u.tipo} | EmpresaID: ${u.empresa_id}`));

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

listData();
