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

async function diagnose() {
    try {
        await ds.initialize();
        console.log('--- DIAGNÓSTICO DE LOGIN ---');
        const email = 'locadora@gmail.com';
        const usuarioRepo = ds.getRepository(Usuario);
        const usuario = await usuarioRepo.findOne({ where: { email } });

        if (!usuario) {
            console.log(`RESULTADO: O usuário ${email} ainda NÃO existe no banco.`);
        } else {
            console.log(`RESULTADO: Usuário ${email} LOCALIZADO.`);
            console.log(`- Ativo: ${usuario.ativo}`);
            console.log(`- Tipo: ${usuario.tipo}`);
            console.log(`- Hash da senha: ${usuario.senha.substring(0, 20)}...`);

            const isPassCorrect = await bcrypt.compare('123', usuario.senha);
            console.log(`- Teste de senha '123': ${isPassCorrect ? 'VÁLIDA' : 'INVÁLIDA'}`);
        }
    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

diagnose();
