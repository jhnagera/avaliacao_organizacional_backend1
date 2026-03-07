import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { ContraCheque } from '../entities/ContraCheque';
import { AuthRequest } from '../middlewares/auth';
import path from 'path';
import fs from 'fs';

export class ContraChequeController {
  async upload(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      const { usuario_id, mes, ano } = req.body;
      const empresa_id = req.user?.empresa_id;

      if (!usuario_id || !mes || !ano) {
        return res.status(400).json({ error: 'Usuário, mês e ano são obrigatórios.' });
      }

      const contrachequeRepository = AppDataSource.getRepository(ContraCheque);
      const contracheque = contrachequeRepository.create({
        usuario_id,
        mes: parseInt(mes),
        ano: parseInt(ano),
        empresa_id,
        arquivo_url: req.file.filename
      });

      await contrachequeRepository.save(contracheque);
      return res.status(201).json(contracheque);
    } catch (error) {
      console.error('Erro no upload de contracheque:', error);
      return res.status(500).json({ error: 'Erro ao realizar upload do contracheque.' });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const usuario_id = req.user?.id;
      const empresa_id = req.user?.empresa_id;
      const { mes, ano, usuario_id: filtro_usuario_id } = req.query;
      const isRHorAdmin = req.user?.tipo === 'admin' || req.user?.tipo === 'rh' || req.user?.tipo === 'super_admin';

      const contrachequeRepository = AppDataSource.getRepository(ContraCheque);
      const where: any = { empresa_id };

      if (isRHorAdmin) {
        // Admin/RH pode filtrar por um usuário específico ou ver todos da empresa
        if (filtro_usuario_id) {
          where.usuario_id = filtro_usuario_id;
        }
      } else {
        // Colaborador comum só vê os seus
        where.usuario_id = usuario_id;
      }

      if (mes) where.mes = parseInt(mes as string);
      if (ano) where.ano = parseInt(ano as string);

      const contracheques = await contrachequeRepository.find({
        where,
        relations: ['usuario'],
        order: { ano: 'DESC', mes: 'DESC' }
      });

      return res.json(contracheques);
    } catch (error) {
      console.error('Erro ao listar contracheques:', error);
      return res.status(500).json({ error: 'Erro ao listar contracheques.' });
    }
  }

  async download(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const usuario_id = req.user?.id;
      const empresa_id = req.user?.empresa_id;
      const isRHorAdmin = req.user?.tipo === 'admin' || req.user?.tipo === 'rh' || req.user?.tipo === 'super_admin';

      const contrachequeRepository = AppDataSource.getRepository(ContraCheque);
      
      const where: any = { id, empresa_id };
      if (!isRHorAdmin) {
        where.usuario_id = usuario_id;
      }

      const contracheque = await contrachequeRepository.findOne({ where });

      if (!contracheque) {
        return res.status(404).json({ error: 'Contracheque não encontrado ou acesso negado.' });
      }

      const filePath = path.resolve(__dirname, '..', '..', 'uploads', 'contracheques', contracheque.arquivo_url);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado no servidor.' });
      }

      return res.download(filePath, `contracheque_${contracheque.mes}_${contracheque.ano}.pdf`);
    } catch (error) {
      console.error('Erro no download de contracheque:', error);
      return res.status(500).json({ error: 'Erro ao realizar download do contracheque.' });
    }
  }

  async visualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const usuario_id = req.user?.id;
      const empresa_id = req.user?.empresa_id;
      const isRHorAdmin = req.user?.tipo === 'admin' || req.user?.tipo === 'rh' || req.user?.tipo === 'super_admin';

      const contrachequeRepository = AppDataSource.getRepository(ContraCheque);
      
      const where: any = { id, empresa_id };
      if (!isRHorAdmin) {
        where.usuario_id = usuario_id;
      }

      const contracheque = await contrachequeRepository.findOne({ where });

      if (!contracheque) {
        return res.status(404).json({ error: 'Contracheque não encontrado ou acesso negado.' });
      }

      const filePath = path.resolve(__dirname, '..', '..', 'uploads', 'contracheques', contracheque.arquivo_url);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado no servidor.' });
      }

      const file = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=contracheque.pdf');
      return res.send(file);
    } catch (error) {
      console.error('Erro na visualização de contracheque:', error);
      return res.status(500).json({ error: 'Erro ao visualizar o contracheque.' });
    }
  }
}
