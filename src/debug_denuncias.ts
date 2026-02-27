import 'reflect-metadata';
import { AppDataSource } from './config/database';

async function check() {
    try {
        await AppDataSource.initialize();

        const admins = await AppDataSource.query(
            "SELECT email, senha, tipo, empresa_id FROM usuarios WHERE tipo IN ('admin','super_admin')"
        );
        admins.forEach((a: any) => console.log(
            `email=${a.email} tipo=${a.tipo} hash=${a.senha.substring(0, 15)}... eid=${a.empresa_id}`
        ));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
}

check();
