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

async function debugSenha() {
    try {
        await ds.initialize();
        console.log('=== DIAGNÓSTICO COMPLETO DE SENHA ===\n');
        const email = 'locadora@gmail.com';
        const usuarioRepo = ds.getRepository(Usuario);
        const usuario = await usuarioRepo.findOne({ where: { email } });

        if (!usuario) {
            console.log(`❌ Usuário ${email} NÃO existe no banco.`);
            return;
        }

        console.log(`✅ Usuário encontrado: ${usuario.nome}`);
        console.log(`   - Email: ${usuario.email}`);
        console.log(`   - Tipo: ${usuario.tipo}`);
        console.log(`   - Ativo: ${usuario.ativo}`);
        console.log(`   - Empresa ID: ${usuario.empresa_id}`);
        console.log(`   - Hash salvo: ${usuario.senha}`);
        console.log(`   - Prefixo do hash: ${usuario.senha.substring(0, 4)}`);
        console.log('');

        const senhasParaTestar = ['123', '1234', 'admin', 'locadora', 'Admin@123', '12345678', 'senha123'];
        console.log('Testando senhas possíveis:');
        for (const senha of senhasParaTestar) {
            const valida = await bcrypt.compare(senha, usuario.senha);
            console.log(`   - "${senha}": ${valida ? '✅ VÁLIDA' : '❌ inválida'}`);
        }

        // Detectar se há double hash
        console.log('\nVerificando double hash...');
        // Se o hash foi hasheado duas vezes, tentar a senha "raw" como string hash
        const isDoubleHash = usuario.senha.startsWith('$2a$') || usuario.senha.startsWith('$2b$');
        console.log(`   - Hash parece válido (começa com $2a$ ou $2b$): ${isDoubleHash}`);

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

debugSenha();
