import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Questionario } from '../entities/Questionario';
import { Questao } from '../entities/Questao';
import { OpcaoResposta } from '../entities/OpcaoResposta';
import { RespostaQuestionario } from '../entities/RespostaQuestionario';
import { AuthRequest } from '../middlewares/auth';

export class QuestionarioController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;
      const { titulo, descricao, data_inicio, data_fim, anonimo, questoes } = req.body;

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      
      const questionario = questionarioRepository.create({
        titulo,
        descricao,
        data_inicio,
        data_fim,
        anonimo,
        empresa_id,
        questoes: questoes?.map((q: any, index: number) => ({
          pergunta: q.pergunta,
          tipo: q.tipo,
          obrigatoria: q.obrigatoria || false,
          ordem: index + 1,
          opcoes: q.opcoes?.map((o: any, i: number) => ({
            texto: o.texto,
            valor: o.valor,
            ordem: i + 1
          }))
        }))
      });

      await questionarioRepository.save(questionario);

      return res.status(201).json(questionario);
    } catch (error) {
      console.error('Erro ao criar questionário:', error);
      return res.status(500).json({ error: 'Erro ao criar questionário' });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const empresa_id = req.user?.empresa_id;

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      const questionarios = await questionarioRepository.find({
        where: { empresa_id },
        relations: ['questoes', 'questoes.opcoes'],
        order: { criado_em: 'DESC' }
      });

      return res.json(questionarios);
    } catch (error) {
      console.error('Erro ao listar questionários:', error);
      return res.status(500).json({ error: 'Erro ao listar questionários' });
    }
  }

  async buscarPorId(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      const questionario = await questionarioRepository.findOne({
        where: { id, empresa_id },
        relations: ['questoes', 'questoes.opcoes']
      });

      if (!questionario) {
        return res.status(404).json({ error: 'Questionário não encontrado' });
      }

      return res.json(questionario);
    } catch (error) {
      console.error('Erro ao buscar questionário:', error);
      return res.status(500).json({ error: 'Erro ao buscar questionário' });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const dados = req.body;

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      const questionario = await questionarioRepository.findOne({ 
        where: { id, empresa_id } 
      });

      if (!questionario) {
        return res.status(404).json({ error: 'Questionário não encontrado' });
      }

      questionarioRepository.merge(questionario, dados);
      await questionarioRepository.save(questionario);

      return res.json(questionario);
    } catch (error) {
      console.error('Erro ao atualizar questionário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar questionário' });
    }
  }

  async deletar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      const questionario = await questionarioRepository.findOne({ 
        where: { id, empresa_id } 
      });

      if (!questionario) {
        return res.status(404).json({ error: 'Questionário não encontrado' });
      }

      await questionarioRepository.remove(questionario);

      return res.json({ message: 'Questionário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar questionário:', error);
      return res.status(500).json({ error: 'Erro ao deletar questionário' });
    }
  }

  async responder(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const usuario_id = req.user?.id;
      const { respostas } = req.body; // Array de { questao_id, opcao_id?, resposta_texto?, resposta_valor? }

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      const respostaRepository = AppDataSource.getRepository(RespostaQuestionario);

      const questionario = await questionarioRepository.findOne({
        where: { id },
        relations: ['questoes']
      });

      if (!questionario) {
        return res.status(404).json({ error: 'Questionário não encontrado' });
      }

      if (questionario.status !== 'ativo') {
        return res.status(400).json({ error: 'Questionário não está ativo' });
      }

      const respostasSalvas = [];

      for (const resposta of respostas) {
        const respostaQuestionario = respostaRepository.create({
          questionario_id: id,
          usuario_id: questionario.anonimo ? null : usuario_id,
          questao_id: resposta.questao_id,
          opcao_id: resposta.opcao_id,
          resposta_texto: resposta.resposta_texto,
          resposta_valor: resposta.resposta_valor
        });

        await respostaRepository.save(respostaQuestionario);
        respostasSalvas.push(respostaQuestionario);
      }

      return res.status(201).json({
        message: 'Respostas registradas com sucesso',
        respostas: respostasSalvas
      });
    } catch (error) {
      console.error('Erro ao responder questionário:', error);
      return res.status(500).json({ error: 'Erro ao responder questionário' });
    }
  }

  async obterResultados(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      const respostaRepository = AppDataSource.getRepository(RespostaQuestionario);

      const questionario = await questionarioRepository.findOne({
        where: { id, empresa_id },
        relations: ['questoes', 'questoes.opcoes']
      });

      if (!questionario) {
        return res.status(404).json({ error: 'Questionário não encontrado' });
      }

      const respostas = await respostaRepository.find({
        where: { questionario_id: id },
        relations: ['questao', 'opcao', 'usuario']
      });

      const totalRespostas = await respostaRepository
        .createQueryBuilder('resposta')
        .select('COUNT(DISTINCT resposta.usuario_id)', 'total')
        .where('resposta.questionario_id = :id', { id })
        .getRawOne();

      const resultadosPorQuestao = questionario.questoes.map(questao => {
        const respostasQuestao = respostas.filter(r => r.questao_id === questao.id);
        
        let estatisticas = {};

        if (questao.tipo === 'multipla_escolha' || questao.tipo === 'sim_nao') {
          const contagemOpcoes: any = {};
          questao.opcoes.forEach(opcao => {
            contagemOpcoes[opcao.id] = {
              texto: opcao.texto,
              quantidade: respostasQuestao.filter(r => r.opcao_id === opcao.id).length
            };
          });
          estatisticas = { opcoes: contagemOpcoes };
        } else if (questao.tipo === 'escala') {
          const valores = respostasQuestao.map(r => r.resposta_valor || 0);
          const media = valores.reduce((a, b) => a + b, 0) / valores.length || 0;
          estatisticas = { 
            media: media.toFixed(2),
            total_respostas: valores.length
          };
        } else if (questao.tipo === 'texto_livre') {
          estatisticas = {
            respostas_texto: respostasQuestao.map(r => ({
              texto: r.resposta_texto,
              data: r.respondido_em
            }))
          };
        }

        return {
          questao_id: questao.id,
          pergunta: questao.pergunta,
          tipo: questao.tipo,
          total_respostas: respostasQuestao.length,
          estatisticas
        };
      });

      return res.json({
        questionario: {
          id: questionario.id,
          titulo: questionario.titulo,
          total_participantes: parseInt(totalRespostas.total) || 0
        },
        resultados: resultadosPorQuestao
      });
    } catch (error) {
      console.error('Erro ao obter resultados:', error);
      return res.status(500).json({ error: 'Erro ao obter resultados' });
    }
  }
}
