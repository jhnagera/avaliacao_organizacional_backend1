import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

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
    entities: [],
});

async function listarSQL() {
    try {
        await ds.initialize();

        const usuarios = await ds.query(`
            SELECT u.email, u.nome, u.tipo, u.ativo, u.empresa_id, e.nome as empresa_nome
            FROM usuarios u
            LEFT JOIN empresas e ON e.id = u.empresa_id
            ORDER BY u.criado_em
        `);

        console.log('\n=== USUÁRIOS ===');
        console.log(JSON.stringify(usuarios, null, 2));

        const empresas = await ds.query(`SELECT id, nome, cnpj, ativo FROM empresas ORDER BY nome`);
        console.log('\n=== EMPRESAS ===');
        console.log(JSON.stringify(empresas, null, 2));

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

listarSQL();
