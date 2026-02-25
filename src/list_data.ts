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
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'avaliacao_organizacional',
    synchronize: false,
    logging: false,
    entities: [Usuario, Empresa, Departamento, Questionario, Questao, Aviso, RespostaQuestionario, Reclamacao, Denuncia, Arquivo, OpcaoResposta],
});

async function listarTodos() {
    try {
        await ds.initialize();
        const usuarioRepo = ds.getRepository(Usuario);
        const empresaRepo = ds.getRepository(Empresa);

        console.log('\n=== TODOS OS USUÁRIOS NO BANCO ===\n');
        const usuarios = await usuarioRepo.find({ order: { criado_em: 'ASC' } });

        for (const u of usuarios) {
            console.log(`Email: ${u.email}`);
            console.log(`  Nome: ${u.nome}`);
            console.log(`  Tipo: ${u.tipo}`);
            console.log(`  Ativo: ${u.ativo}`);
            console.log(`  empresa_id: ${u.empresa_id}`);
            console.log(`  Criado em: ${u.criado_em}`);
            console.log('');
        }

        console.log('\n=== TODAS AS EMPRESAS NO BANCO ===\n');
        const empresas = await empresaRepo.find({ order: { nome: 'ASC' } });

        for (const e of empresas) {
            console.log(`Nome: ${e.nome}`);
            console.log(`  ID: ${e.id}`);
            console.log(`  CNPJ: ${e.cnpj}`);
            console.log(`  Ativo: ${e.ativo}`);
            console.log('');
        }

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

listarTodos();
