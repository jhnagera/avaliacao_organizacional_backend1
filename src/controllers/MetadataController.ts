import { Request, Response } from 'express';
import { TipoQuestao } from '../entities/Questao';
import { StatusQuestionario, TipoQuestionario, TargetQuestionario } from '../entities/Questionario';
import { PrioridadeAviso } from '../entities/Aviso';
import { TipoUsuario } from '../entities/Usuario';

export class MetadataController {
    async getEnums(req: Request, res: Response) {
        try {
            return res.json({
                tipos_questao: Object.values(TipoQuestao),
                status_questionario: Object.values(StatusQuestionario),
                tipos_questionario: Object.values(TipoQuestionario),
                alvos_questionario: Object.values(TargetQuestionario),
                prioridade_aviso: Object.values(PrioridadeAviso),
                tipos_usuario: Object.values(TipoUsuario)
            });
        } catch (error) {
            console.error('Erro ao buscar enums:', error);
            return res.status(500).json({ error: 'Erro ao buscar metadados' });
        }
    }
}
