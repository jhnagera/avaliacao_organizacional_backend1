import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Questao } from './Questao';
import { RespostaQuestionario } from './RespostaQuestionario';
import { Departamento } from './Departamento';
import { Usuario } from './Usuario';

export enum StatusQuestionario {
  RASCUNHO = 'rascunho',
  ATIVO = 'ativo',
  ENCERRADO = 'encerrado'
}

export enum TipoQuestionario {
  PESQUISA_CLIMA = 'pesquisa_clima',
  AVALIACAO_DESEMPENHO = 'avaliacao_desempenho',
  FEEDBACK = 'feedback',
  SAUDE_MENTAL = 'saude_mental',
  OUTRO = 'outro'
}

export enum TargetQuestionario {
  TODOS = 'todos',
  DEPARTAMENTO = 'departamento',
  INDIVIDUAL = 'individual'
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

  @Column({
    type: 'enum',
    enum: TipoQuestionario,
    default: TipoQuestionario.PESQUISA_CLIMA
  })
  tipo: TipoQuestionario;

  @Column({
    type: 'enum',
    enum: TargetQuestionario,
    default: TargetQuestionario.TODOS
  })
  destinatario_tipo: TargetQuestionario;

  @Column({ type: 'date', nullable: true })
  data_inicio: Date;

  @Column({ type: 'date', nullable: true })
  data_fim: Date;

  @Column({ default: false })
  anonimo: boolean;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @Column({ type: 'uuid', nullable: true })
  departamento_id: string;

  @Column({ type: 'uuid', nullable: true })
  usuario_id: string;

  @ManyToOne(() => Empresa, empresa => empresa.questionarios)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => Departamento)
  @JoinColumn({ name: 'departamento_id' })
  departamento: Departamento;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Questao, questao => questao.questionario, { cascade: true })
  questoes: Questao[];

  @OneToMany(() => RespostaQuestionario, resposta => resposta.questionario)
  respostas: RespostaQuestionario[];

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
