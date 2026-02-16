import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Questionario } from './Questionario';
import { OpcaoResposta } from './OpcaoResposta';

export enum TipoQuestao {
  MULTIPLA_ESCOLHA = 'multipla_escolha',
  ESCALA = 'escala',
  TEXTO_LIVRE = 'texto_livre',
  SIM_NAO = 'sim_nao'
}

@Entity('questoes')
export class Questao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  pergunta: string;

  @Column({
    type: 'enum',
    enum: TipoQuestao,
    default: TipoQuestao.MULTIPLA_ESCOLHA
  })
  tipo: TipoQuestao;

  @Column({ default: false })
  obrigatoria: boolean;

  @Column({ type: 'int' })
  ordem: number;

  @Column({ type: 'uuid' })
  questionario_id: string;

  @ManyToOne(() => Questionario, questionario => questionario.questoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionario_id' })
  questionario: Questionario;

  @OneToMany(() => OpcaoResposta, opcao => opcao.questao, { cascade: true })
  opcoes: OpcaoResposta[];

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
