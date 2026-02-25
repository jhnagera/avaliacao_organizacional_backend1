import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Empresa } from './entities/Empresa';

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
    entities: [Empresa],
});

async function listEmpresas() {
    try {
        await ds.initialize();
        const empresaRepo = ds.getRepository(Empresa);
        const empresas = await empresaRepo.find();
        console.log('--- LISTA DE EMPRESAS ---');
        empresas.forEach(e => console.log(`- Nome: ${e.nome} | ID: ${e.id} | CNPJ: ${e.cnpj}`));
    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

listEmpresas();
