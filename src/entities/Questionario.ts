import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Questao } from './Questao';
import { RespostaQuestionario } from './RespostaQuestionario';

export enum StatusQuestionario {
  RASCUNHO = 'rascunho',
  ATIVO = 'ativo',
  ENCERRADO = 'encerrado'
}

@Entity('questionarios')
export class Questionario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusQuestionario,
    default: StatusQuestionario.RASCUNHO
  })
  status: StatusQuestionario;

  @Column({ type: 'date', nullable: true })
  data_inicio: Date;

  @Column({ type: 'date', nullable: true })
  data_fim: Date;

  @Column({ default: false })
  anonimo: boolean;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @ManyToOne(() => Empresa, empresa => empresa.questionarios)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @OneToMany(() => Questao, questao => questao.questionario, { cascade: true })
  questoes: Questao[];

  @OneToMany(() => RespostaQuestionario, resposta => resposta.questionario)
  respostas: RespostaQuestionario[];

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
