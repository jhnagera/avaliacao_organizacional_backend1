import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Empresa } from '../entities/Empresa';
import { AuthRequest } from '../middlewares/auth';

export class EmpresaController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, cnpj, razao_social, endereco, telefone, email } = req.body;

      const empresaRepository = AppDataSource.getRepository(Empresa);

      const empresaExistente = await empresaRepository.findOne({ where: { cnpj } });
      if (empresaExistente) {
        return res.status(400).json({ error: 'CNPJ já cadastrado' });
      }

      const empresa = empresaRepository.create({
        nome,
        cnpj,
        razao_social,
        endereco,
        telefone,
        email
      });

      await empresaRepository.save(empresa);

      return res.status(201).json(empresa);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      return res.status(500).json({ error: 'Erro ao criar empresa' });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const empresaRepository = AppDataSource.getRepository(Empresa);
      const empresas = await empresaRepository.find({
        order: { nome: 'ASC' }
      });

      return res.json(empresas);
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      return res.status(500).json({ error: 'Erro ao listar empresas' });
    }
  }

  async listarPublico(req: Request, res: Response) {
    try {
      const empresaRepository = AppDataSource.getRepository(Empresa);
      const empresas = await empresaRepository.find({
        select: ['id', 'nome'],
        where: { ativo: true },
        order: { nome: 'ASC' }
      });

      return res.json(empresas);
    } catch (error) {
      console.error('Erro ao listar empresas publicamente:', error);
      return res.status(500).json({ error: 'Erro ao listar empresas' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const empresaRepository = AppDataSource.getRepository(Empresa);
      const empresa = await empresaRepository.findOne({
        where: { id },
        relations: ['departamentos', 'usuarios']
      });

      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      return res.json(empresa);
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      return res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dados = req.body;

      const empresaRepository = AppDataSource.getRepository(Empresa);
      const empresa = await empresaRepository.findOne({ where: { id } });

      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      empresaRepository.merge(empresa, dados);
      await empresaRepository.save(empresa);

      return res.json(empresa);
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      return res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const empresaRepository = AppDataSource.getRepository(Empresa);
      const empresa = await empresaRepository.findOne({ where: { id } });

      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      empresa.ativo = false;
      await empresaRepository.save(empresa);

      return res.json({ message: 'Empresa desativada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      return res.status(500).json({ error: 'Erro ao deletar empresa' });
    }
  }
}
