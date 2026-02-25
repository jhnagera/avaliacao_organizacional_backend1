import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Questionario } from './Questionario';
import { Usuario } from './Usuario';
import { Questao } from './Questao';
import { OpcaoResposta } from './OpcaoResposta';

@Entity('respostas_questionario')
export class RespostaQuestionario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  questionario_id: string;

  @Column({ type: 'uuid', nullable: true })
  usuario_id: string | null;

  @Column({ type: 'uuid' })
  questao_id: string;

  @Column({ type: 'uuid', nullable: true })
  opcao_id: string | null;

  @Column({ type: 'text', nullable: true })
  resposta_texto: string;

  @Column({ type: 'int', nullable: true })
  resposta_valor: number;

  @ManyToOne(() => Questionario, questionario => questionario.respostas)
  @JoinColumn({ name: 'questionario_id' })
  questionario: Questionario;

  @ManyToOne(() => Usuario, usuario => usuario.respostas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Questao)
  @JoinColumn({ name: 'questao_id' })
  questao: Questao;

  @ManyToOne(() => OpcaoResposta)
  @JoinColumn({ name: 'opcao_id' })
  opcao: OpcaoResposta;

  @CreateDateColumn()
  respondido_em: Date;
}
