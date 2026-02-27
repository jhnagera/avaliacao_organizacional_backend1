import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { DenunciaController, ReclamacaoController } from './controllers/OutrosControllers';
import { TipoUsuario } from './entities/Usuario';

async function test() {
    try {
        await AppDataSource.initialize();
        console.log('Testing visibility logic...');

        const denunciaController = new DenunciaController();
        const reclamacaoController = new ReclamacaoController();

        // Mock AuthRequest para super_admin
        const reqSuperAdmin = {
            user: {
                id: 'any',
                email: 'super@admin.com',
                tipo: TipoUsuario.SUPER_ADMIN,
                empresa_id: null as any
            },
            query: {},
            params: {}
        } as any;

        // Mock AuthRequest para admin comum (com empresa vinculada)
        const reqAdminComum = {
            user: {
                id: 'any',
                email: 'admin@empresa1.com',
                tipo: TipoUsuario.ADMIN,
                empresa_id: '78e68607-4ad1-43bf-974b-0a31586b9d5d'
            },
            query: {},
            params: {}
        } as any;

        const resMock = {
            json: (data: any) => {
                console.log('Result count:', data.length);
                return resMock;
            },
            status: (code: number) => {
                console.log('Status code:', code);
                return resMock;
            }
        } as any;

        console.log('\n--- Testando DenunciaController.listar (Super Admin) ---');
        await denunciaController.listar(reqSuperAdmin, resMock);

        console.log('\n--- Testando DenunciaController.listar (Admin Comum) ---');
        await denunciaController.listar(reqAdminComum, resMock);

        console.log('\n--- Testando ReclamacaoController.listar (Super Admin) ---');
        await reclamacaoController.listar(reqSuperAdmin, resMock);

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
}

test();
