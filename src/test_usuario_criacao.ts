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
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'avaliacao_organizacional',
    synchronize: false,
    logging: false,
    entities: [Usuario, Empresa, Departamento, Questionario, Questao, Aviso, RespostaQuestionario, Reclamacao, Denuncia, Arquivo, OpcaoResposta],
});

async function testarCriacao() {
    try {
        await ds.initialize();
        const usuarioRepo = ds.getRepository(Usuario);

        const emailTeste = 'teste_criacao@gmail.com';
        const senhaTeste = 'minhasenha123';
        const empresa_id = 'a736b784-ede0-4239-832d-50518514f773';

        // Limpar usuário de teste anterior
        const usuarioExistente = await usuarioRepo.findOne({ where: { email: emailTeste } });
        if (usuarioExistente) {
            await usuarioRepo.delete({ email: emailTeste });
            console.log('Usuário de teste anterior removido.');
        }

        console.log('\n=== SIMULANDO CRIAÇÃO VIA API (como o UsuarioController faz) ===');
        console.log(`Criando usuário com senha em texto: "${senhaTeste}"`);

        // Este é exatamente o que o UsuarioController fa:
        const usuario = usuarioRepo.create({
            nome: 'Usuario Teste Criacao',
            email: emailTeste,
            senha: senhaTeste,  // Senha em TEXTO PLANO, como vem do body
            tipo: TipoUsuario.ADMIN,
            empresa_id: empresa_id,
            ativo: true
        });

        await usuarioRepo.save(usuario); // @BeforeInsert deve hashear aqui

        // Recarregar do banco
        const usuarioSalvo = await usuarioRepo.findOne({ where: { email: emailTeste } });
        console.log(`\nHash gerado no banco: ${usuarioSalvo?.senha}`);
        console.log(`Prefixo do hash: ${usuarioSalvo?.senha.substring(0, 4)}`);

        // Testar a senha
        const senhaValida = await bcrypt.compare(senhaTeste, usuarioSalvo!.senha);
        console.log(`\nTeste de login com senha original "${senhaTeste}": ${senhaValida ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);

        if (!senhaValida) {
            console.log('\n🚨 PROBLEMA DETECTADO: Double hash!');
            console.log('O @BeforeInsert está hasheando a senha duas vezes ou a verificação está incorreta.');

            // Tentar com o hash da senha (para confirmar double hash)
            const hashDaSenha = await bcrypt.hash(senhaTeste, 10);
            const isDoubleHash = await bcrypt.compare(hashDaSenha, usuarioSalvo!.senha);
            console.log(`Teste de double hash: ${isDoubleHash ? '✅ CONFIRMADO - é double hash!' : '❌ Não é double hash'}`);
        }

        // Limpar
        await usuarioRepo.delete({ email: emailTeste });
        console.log('\nUsuário de teste removido.');

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        process.exit(0);
    }
}

testarCriacao();
