import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Usuario, TipoUsuario } from './entities/Usuario';
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
import bcrypt from 'bcryptjs';

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

async function createAdmin() {
    try {
        await ds.initialize();
        const usuarioRepo = ds.getRepository(Usuario);

        const email = 'locadora@gmail.com';
        const empresa_id = 'a736b784-ede0-4239-832d-50518514f773'; // ID da empresa locadora mais recente

        const hashSenha = await bcrypt.hash('123', 10);

        const novoUsuario = usuarioRepo.create({
            nome: 'Admin Locadora',
            email: email,
            senha: hashSenha,
            tipo: TipoUsuario.ADMIN,
            empresa_id: empresa_id,
            ativo: true
        });

        await usuarioRepo.save(novoUsuario);
        console.log(`✅ Usuário ${email} criado com sucesso para a empresa ${empresa_id}!`);

    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error);
    } finally {
        process.exit(0);
    }
}

createAdmin();
