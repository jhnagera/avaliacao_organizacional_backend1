import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Departamento } from '../entities/Departamento';
import { AuthRequest } from '../middlewares/auth';

export class DepartamentoController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const { nome, descricao } = req.body;

      const departamentoRepository = AppDataSource.getRepository(Departamento);
      const departamento = departamentoRepository.create({ nome, descricao, empresa_id });
      await departamentoRepository.save(departamento);

      return res.status(201).json(departamento);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar departamento' });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const departamentoRepository = AppDataSource.getRepository(Departamento);
      const departamentos = await departamentoRepository.find({ 
        where: { empresa_id },
        order: { nome: 'ASC' }
      });

      return res.json(departamentos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar departamentos' });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const dados = req.body;

      const departamentoRepository = AppDataSource.getRepository(Departamento);
      const departamento = await departamentoRepository.findOne({ where: { id, empresa_id } });

      if (!departamento) {
        return res.status(404).json({ error: 'Departamento não encontrado' });
      }

      departamentoRepository.merge(departamento, dados);
      await departamentoRepository.save(departamento);

      return res.json(departamento);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar departamento' });
    }
  }

  async deletar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;

      const departamentoRepository = AppDataSource.getRepository(Departamento);
      const departamento = await departamentoRepository.findOne({ where: { id, empresa_id } });

      if (!departamento) {
        return res.status(404).json({ error: 'Departamento não encontrado' });
      }

      departamento.ativo = false;
      await departamentoRepository.save(departamento);

      return res.json({ message: 'Departamento desativado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar departamento' });
    }
  }
}
