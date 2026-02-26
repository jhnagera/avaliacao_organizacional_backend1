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
      const { titulo, descricao, data_inicio, data_fim, anonimo, tipo, destinatario_tipo, departamento_id, usuario_id, questoes, empresa_id: empresa_id_body } = req.body;

      // Se for super_admin, permite determinar a empresa, senão usa a do token
      let empresa_id = req.user?.tipo === 'super_admin' ? (empresa_id_body || req.user?.empresa_id) : req.user?.empresa_id;

      if (!empresa_id) {
        return res.status(400).json({ error: 'Empresa não selecionada' });
      }

      const questionarioRepository = AppDataSource.getRepository(Questionario);

      const questionario = questionarioRepository.create({
        titulo,
        descricao,
        data_inicio: data_inicio === '' ? null : data_inicio,
        data_fim: data_fim === '' ? null : data_fim,
        anonimo,
        tipo,
        destinatario_tipo,
        departamento_id: departamento_id === '' ? null : departamento_id,
        usuario_id: usuario_id === '' ? null : usuario_id,
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
      const usuario_id = req.user?.id;
      const departamento_id = req.user?.departamento_id;
      const tipo_usuario = req.user?.tipo;

      const questionarioRepository = AppDataSource.getRepository(Questionario);

      let query = questionarioRepository.createQueryBuilder('questionario')
        .leftJoinAndSelect('questionario.questoes', 'questoes')
        .leftJoinAndSelect('questoes.opcoes', 'opcoes')
        .leftJoinAndSelect('questionario.departamento', 'departamento')
        .leftJoinAndSelect('questionario.usuario', 'usuario')
        .where('questionario.empresa_id = :empresa_id', { empresa_id })
        .orderBy('questionario.criado_em', 'DESC');

      // Se for colaborador, filtra pelos destinatários permitidos
      if (tipo_usuario === 'colaborador') {
        query = query.andWhere(
          '(questionario.destinatario_tipo = :todos OR (questionario.destinatario_tipo = :depto AND questionario.departamento_id = :departamento_id) OR (questionario.destinatario_tipo = :individual AND questionario.usuario_id = :usuario_id))',
          {
            todos: 'todos',
            depto: 'departamento',
            departamento_id: departamento_id || '00000000-0000-0000-0000-000000000000',
            individual: 'individual',
            usuario_id: usuario_id || '00000000-0000-0000-0000-000000000000'
          }
        );
        // Colaboradores só veem questionários ativos
        query = query.andWhere('questionario.status = :status', { status: 'ativo' });
      }

      const questionarios = await query.getMany();

      // Verifica se o usuário logado já respondeu cada um dos questionários
      const respostaRepository = AppDataSource.getRepository(RespostaQuestionario);
      const questionariosComStatus = await Promise.all(questionarios.map(async (q) => {
        if (!usuario_id) return { ...q, respondido: false };

        const respostaExistente = await respostaRepository.findOne({
          where: { questionario_id: q.id, usuario_id }
        });

        return { ...q, respondido: !!respostaExistente };
      }));

      return res.json(questionariosComStatus);
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
        relations: ['questoes', 'questoes.opcoes', 'departamento', 'usuario']
      });

      if (!questionario) {
        return res.status(404).json({ error: 'Questionário não encontrado' });
      }

      let respondido = false;
      if (req.user?.id) {
        const respostaRepository = AppDataSource.getRepository(RespostaQuestionario);
        const respostaExistente = await respostaRepository.findOne({
          where: { questionario_id: id, usuario_id: req.user.id }
        });
        respondido = !!respostaExistente;
      }

      return res.json({ ...questionario, respondido });
    } catch (error) {
      console.error('Erro ao buscar questionário:', error);
      return res.status(500).json({ error: 'Erro ao buscar questionário' });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const empresa_id = req.user?.empresa_id;
      const { questoes, ...dadosQuestionario } = req.body;

      if (dadosQuestionario.departamento_id === '') dadosQuestionario.departamento_id = null;
      if (dadosQuestionario.usuario_id === '') dadosQuestionario.usuario_id = null;
      if (dadosQuestionario.data_inicio === '') dadosQuestionario.data_inicio = null;
      if (dadosQuestionario.data_fim === '') dadosQuestionario.data_fim = null;

      const questionarioRepository = AppDataSource.getRepository(Questionario);
      const questaoRepository = AppDataSource.getRepository(Questao);
      const opcaoRepository = AppDataSource.getRepository(OpcaoResposta);

      const questionario = await questionarioRepository.findOne({
        where: { id, empresa_id },
        relations: ['questoes', 'questoes.opcoes']
      });

      if (!questionario) {
        return res.status(404).json({ error: 'Questionário não encontrado' });
      }

      // Atualiza campos básicos
      questionarioRepository.merge(questionario, dadosQuestionario);

      if (questoes) {
        // IDs das questões que vieram na requisição
        const questoesIdsRequest = questoes.filter((q: any) => q.id).map((q: any) => q.id);

        // Remove questões que não estão mais presentes
        const questoesParaRemover = questionario.questoes.filter(q => !questoesIdsRequest.includes(q.id));
        if (questoesParaRemover.length > 0) {
          await questaoRepository.remove(questoesParaRemover);
        }

        // Atualiza ou cria novas questões
        questionario.questoes = await Promise.all(questoes.map(async (q: any, index: number) => {
          let questao = questionario.questoes.find(existingQ => existingQ.id === q.id);

          if (questao) {
            // Atualiza questão existente
            questao.pergunta = q.pergunta;
            questao.tipo = q.tipo;
            questao.obrigatoria = q.obrigatoria ?? false;
            questao.ordem = index + 1;

            // Gerencia opções da questão
            if (q.opcoes) {
              const opcoesIdsRequest = q.opcoes.filter((o: any) => o.id).map((o: any) => o.id);
              const opcoesParaRemover = questao.opcoes.filter(o => !opcoesIdsRequest.includes(o.id));

              if (opcoesParaRemover.length > 0) {
                await opcaoRepository.remove(opcoesParaRemover);
              }

              questao.opcoes = q.opcoes.map((o: any, i: number) => {
                let opcao = questao!.opcoes.find(existingO => existingO.id === o.id);
                if (opcao) {
                  opcao.texto = o.texto;
                  opcao.valor = o.valor;
                  opcao.ordem = i + 1;
                  return opcao;
                }
                return opcaoRepository.create({
                  texto: o.texto,
                  valor: o.valor,
                  ordem: i + 1
                });
              });
            } else {
              questao.opcoes = [];
            }
            return questao;
          } else {
            // Cria nova questão
            return questaoRepository.create({
              pergunta: q.pergunta,
              tipo: q.tipo,
              obrigatoria: q.obrigatoria ?? false,
              ordem: index + 1,
              opcoes: q.opcoes?.map((o: any, i: number) => ({
                texto: o.texto,
                valor: o.valor,
                ordem: i + 1
              }))
            });
          }
        }));
      }

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

      if (usuario_id) {
        const respostaExistente = await respostaRepository.findOne({
          where: { questionario_id: id, usuario_id }
        });

        if (respostaExistente) {
          return res.status(400).json({ error: 'Você já respondeu a este questionário.' });
        }
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

      // Agrupar respostas detalhadas por usuário (se o questionário não for anônimo)
      const respostasDetalhadas: any[] = [];
      if (!questionario.anonimo) {
        const agruparPorUsuario: Record<string, any> = {};
        respostas.forEach(r => {
          if (!r.usuario) return;
          if (!agruparPorUsuario[r.usuario.id]) {
            agruparPorUsuario[r.usuario.id] = {
              usuario_id: r.usuario.id,
              nome: r.usuario.nome,
              email: r.usuario.email,
              data: r.respondido_em,
              respostas: {}
            };
          }
          let respostaConvertida = r.resposta_texto;
          if (r.questao.tipo === 'multipla_escolha' || r.questao.tipo === 'sim_nao') {
            respostaConvertida = r.opcao ? r.opcao.texto : '';
          } else if (r.questao.tipo === 'escala') {
            respostaConvertida = String(r.resposta_valor);
          }
          agruparPorUsuario[r.usuario.id].respostas[r.questao_id] = respostaConvertida;
        });
        respostasDetalhadas.push(...Object.values(agruparPorUsuario));
      }

      return res.json({
        questionario: {
          id: questionario.id,
          titulo: questionario.titulo,
          total_participantes: parseInt(totalRespostas.total) || 0,
          anonimo: questionario.anonimo,
        },
        resultados: resultadosPorQuestao,
        respostas_detalhadas: respostasDetalhadas
      });
    } catch (error) {
      console.error('Erro ao obter resultados:', error);
      return res.status(500).json({ error: 'Erro ao obter resultados' });
    }
  }

  async obterMinhasRespostas(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const usuario_id = req.user?.id;

      if (!usuario_id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const respostaRepository = AppDataSource.getRepository(RespostaQuestionario);
      const respostas = await respostaRepository.find({
        where: { questionario_id: id, usuario_id }
      });

      return res.json(respostas);
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      return res.status(500).json({ error: 'Erro ao buscar respostas do usuário' });
    }
  }
}
