import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';
import jwt from 'jsonwebtoken';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({
        where: { email },
        relations: ['empresa', 'departamento']
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (!usuario.ativo) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      const senhaValida = await usuario.validatePassword(senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          tipo: usuario.tipo,
          empresa_id: usuario.empresa_id
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      const { senha: _, ...usuarioSemSenha } = usuario;

      return res.json({
        usuario: usuarioSemSenha,
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  async trocarSenha(req: Request, res: Response) {
    try {
      const { senha_atual, senha_nova } = req.body;
      const usuario_id = (req as any).user.id;

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({ where: { id: usuario_id } });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const senhaValida = await usuario.validatePassword(senha_atual);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      usuario.senha = senha_nova;
      await usuarioRepository.save(usuario);

      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao trocar senha:', error);
      return res.status(500).json({ error: 'Erro ao trocar senha' });
    }
  }
}
