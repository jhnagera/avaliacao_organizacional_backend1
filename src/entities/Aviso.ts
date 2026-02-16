import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';

export enum PrioridadeAviso {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta'
}

@Entity('avisos')
export class Aviso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text' })
  conteudo: string;

  @Column({
    type: 'enum',
    enum: PrioridadeAviso,
    default: PrioridadeAviso.MEDIA
  })
  prioridade: PrioridadeAviso;

  @Column({ type: 'date', nullable: true })
  data_inicio: Date;

  @Column({ type: 'date', nullable: true })
  data_fim: Date;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @ManyToOne(() => Empresa, empresa => empresa.avisos)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
