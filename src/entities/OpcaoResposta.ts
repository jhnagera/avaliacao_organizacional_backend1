import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Questao } from './Questao';

@Entity('opcoes_resposta')
export class OpcaoResposta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'int', nullable: true })
  valor: number;

  @Column({ type: 'int' })
  ordem: number;

  @Column({ type: 'uuid' })
  questao_id: string;

  @ManyToOne(() => Questao, questao => questao.opcoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questao_id' })
  questao: Questao;

  @CreateDateColumn()
  criado_em: Date;
}
