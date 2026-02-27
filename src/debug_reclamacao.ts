import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { Reclamacao, TipoReclamacao, StatusReclamacao } from './entities/Reclamacao';

async function test() {
    try {
        await AppDataSource.initialize();
        console.log('Database initialized');

        const repo = AppDataSource.getRepository(Reclamacao);

        // Get an existing empresa and user to use in the test
        const empresa = await AppDataSource.query('SELECT id FROM empresas LIMIT 1');
        const usuario = await AppDataSource.query('SELECT id FROM usuarios LIMIT 1');

        if (empresa.length === 0 || usuario.length === 0) {
            console.log('No empresa or usuario found to test.');
            return;
        }

        console.log(`Using empresa_id: ${empresa[0].id}, usuario_id: ${usuario[0].id}`);

        const rec = repo.create({
            titulo: 'Teste Debug',
            descricao: 'Descricao de teste',
            tipo: TipoReclamacao.RECLAMACAO,
            status: StatusReclamacao.PENDENTE,
            empresa_id: empresa[0].id,
            usuario_id: usuario[0].id,
            anonimo: false
        });

        await repo.save(rec);
        console.log('✅ Reclamacao saved successfully!');

    } catch (error) {
        console.error('❌ Error saving reclamacao:', error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
}

test();
