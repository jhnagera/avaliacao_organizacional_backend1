import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Aviso } from '../entities/Aviso';
import { Reclamacao } from '../entities/Reclamacao';
import { Denuncia } from '../entities/Denuncia';
import { Arquivo } from '../entities/Arquivo';
import { AuthRequest } from '../middlewares/auth';

export class AvisoController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const { empresa_id: empresa_id_body, ...dados } = req.body;
      let empresa_id = req.user?.tipo === 'super_admin' ? (empresa_id_body || req.user?.empresa_id) : req.user?.empresa_id;

      const avisoRepository = AppDataSource.getRepository(Aviso);
      const aviso = avisoRepository.create({ ...dados, empresa_id });
      await avisoRepository.save(aviso);
      return res.status(201).json(aviso);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar aviso' });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const avisoRepository = AppDataSource.getRepository(Aviso);
      const avisos = await avisoRepository.find({
        where: { empresa_id, ativo: true },
        order: { criado_em: 'DESC' }
      });
      return res.json(avisos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar avisos' });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const avisoRepository = AppDataSource.getRepository(Aviso);
      const aviso = await avisoRepository.findOne({ where: { id, empresa_id } });
      if (!aviso) return res.status(404).json({ error: 'Aviso não encontrado' });
      avisoRepository.merge(aviso, req.body);
      await avisoRepository.save(aviso);
      return res.json(aviso);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar aviso' });
    }
  }

  async deletar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const avisoRepository = AppDataSource.getRepository(Aviso);
      const aviso = await avisoRepository.findOne({ where: { id, empresa_id } });
      if (!aviso) return res.status(404).json({ error: 'Aviso não encontrado' });
      aviso.ativo = false;
      await avisoRepository.save(aviso);
      return res.json({ message: 'Aviso desativado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar aviso' });
    }
  }
}

export class ReclamacaoController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const { empresa_id: empresa_id_body, ...rest } = req.body;
      let empresa_id = req.user?.tipo === 'super_admin' ? (empresa_id_body || req.user?.empresa_id) : req.user?.empresa_id;
      const usuario_id = req.body.anonimo ? null : req.user?.id;
      const reclamacaoRepository = AppDataSource.getRepository(Reclamacao);
      const reclamacao = reclamacaoRepository.create({ ...rest, empresa_id, usuario_id });
      await reclamacaoRepository.save(reclamacao);
      return res.status(201).json(reclamacao);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar reclamação/sugestão' });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const { tipo } = req.query;
      const reclamacaoRepository = AppDataSource.getRepository(Reclamacao);
      const where: any = { empresa_id };
      if (tipo) where.tipo = tipo;
      const reclamacoes = await reclamacaoRepository.find({
        where,
        relations: ['usuario'],
        order: { criado_em: 'DESC' }
      });
      return res.json(reclamacoes);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar reclamações/sugestões' });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const reclamacaoRepository = AppDataSource.getRepository(Reclamacao);
      const reclamacao = await reclamacaoRepository.findOne({ where: { id, empresa_id } });
      if (!reclamacao) return res.status(404).json({ error: 'Reclamação/sugestão não encontrada' });
      reclamacaoRepository.merge(reclamacao, req.body);
      await reclamacaoRepository.save(reclamacao);
      return res.json(reclamacao);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar reclamação/sugestão' });
    }
  }
}

export class DenunciaController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const { empresa_id: empresa_id_body, ...rest } = req.body;
      let empresa_id = req.user?.tipo === 'super_admin' ? (empresa_id_body || req.user?.empresa_id) : req.user?.empresa_id;
      const usuario_id = req.body.anonimo ? null : req.user?.id;
      const denunciaRepository = AppDataSource.getRepository(Denuncia);
      const denuncia = denunciaRepository.create({ ...rest, empresa_id, usuario_id });
      await denunciaRepository.save(denuncia);
      return res.status(201).json(denuncia);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar denúncia' });
    }
  }

  async criarAnonimo(req: Request, res: Response) {
    try {
      const { empresa_id, categoria, descricao } = req.body;

      if (!empresa_id || !categoria || !descricao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const denunciaRepository = AppDataSource.getRepository(Denuncia);
      const denuncia = denunciaRepository.create({
        empresa_id,
        categoria,
        descricao,
        usuario_id: null as any,
        anonimo: true
      });

      await denunciaRepository.save(denuncia);
      return res.status(201).json({ message: 'Denúncia registrada com sucesso' });
    } catch (error) {
      console.error('Erro ao criar denúncia anônima:', error);
      return res.status(500).json({ error: 'Erro ao criar denúncia' });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const denunciaRepository = AppDataSource.getRepository(Denuncia);
      const denuncias = await denunciaRepository.find({
        where: { empresa_id },
        relations: ['usuario'],
        order: { criado_em: 'DESC' }
      });
      return res.json(denuncias);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar denúncias' });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const denunciaRepository = AppDataSource.getRepository(Denuncia);
      const denuncia = await denunciaRepository.findOne({ where: { id, empresa_id } });
      if (!denuncia) return res.status(404).json({ error: 'Denúncia não encontrada' });
      denunciaRepository.merge(denuncia, req.body);
      await denunciaRepository.save(denuncia);
      return res.json(denuncia);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar denúncia' });
    }
  }
}

export class ArquivoController {
  async listar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const arquivoRepository = AppDataSource.getRepository(Arquivo);
      const arquivos = await arquivoRepository.find({
        where: { empresa_id },
        order: { criado_em: 'DESC' }
      });
      return res.json(arquivos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
  }
}
