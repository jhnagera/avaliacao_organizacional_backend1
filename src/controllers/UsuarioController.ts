import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';
import { AuthRequest } from '../middlewares/auth';

export class UsuarioController {

  // ✅ CRIAR — empresa_id vem do token JWT, não do body
  async criar(req: AuthRequest, res: Response) {
    try {
      const { nome, email, senha, cpf, telefone, cargo, tipo, departamento_id } = req.body;
      const empresa_id = req.user?.empresa_id;

      if (!empresa_id) {
        return res.status(401).json({ error: 'Empresa não identificada no token' });
      }
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      const usuarioRepository = AppDataSource.getRepository(Usuario);

      const usuarioExistente = await usuarioRepository.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const usuario = usuarioRepository.create({
        nome,
        email,
        senha,
        cpf: cpf || null,
        telefone: telefone || null,
        cargo: cargo || null,
        tipo: tipo || 'colaborador',
        empresa_id,
        departamento_id: departamento_id || null
      });

      await usuarioRepository.save(usuario);

      const { senha: _, ...usuarioSemSenha } = usuario;
      return res.status(201).json(usuarioSemSenha);

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuarios = await usuarioRepository.find({
        where: { empresa_id },
        relations: ['departamento'],
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          telefone: true,
          cargo: true,
          tipo: true,
          ativo: true,
          criado_em: true
        },
        order: { nome: 'ASC' }
      });

      return res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  }

  async buscarPorId(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({
        where: { id, empresa_id },
        relations: ['departamento'],
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          telefone: true,
          cargo: true,
          tipo: true,
          ativo: true,
          criado_em: true
        }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  // ✅ ATUALIZAR — senha só atualiza se enviada
  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const dados = { ...req.body };

      if (!dados.senha) {
        delete dados.senha;
      }

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({ where: { id, empresa_id } });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      usuarioRepository.merge(usuario, dados);
      await usuarioRepository.save(usuario);

      const { senha: _, ...usuarioSemSenha } = usuario;
      return res.json(usuarioSemSenha);

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  async deletar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({ where: { id, empresa_id } });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      usuario.ativo = false;
      await usuarioRepository.save(usuario);

      return res.json({ message: 'Usuário desativado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }

  async importarPlanilha(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const { usuarios } = req.body;

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuariosCriados = [];
      const erros = [];

      for (const dadosUsuario of usuarios) {
        try {
          const usuarioExistente = await usuarioRepository.findOne({
            where: { email: dadosUsuario.email }
          });

          if (usuarioExistente) {
            erros.push({ email: dadosUsuario.email, erro: 'Email já cadastrado' });
            continue;
          }

          const usuario = usuarioRepository.create({ ...dadosUsuario, empresa_id });
          await usuarioRepository.save(usuario);
          usuariosCriados.push(usuario.email);
        } catch {
          erros.push({ email: dadosUsuario.email, erro: 'Erro ao processar usuário' });
        }
      }

      return res.json({
        sucesso: usuariosCriados.length,
        falhas: erros.length,
        usuarios_criados: usuariosCriados,
        erros
      });
    } catch (error) {
      console.error('Erro ao importar planilha:', error);
      return res.status(500).json({ error: 'Erro ao importar planilha' });
    }
  }
}
