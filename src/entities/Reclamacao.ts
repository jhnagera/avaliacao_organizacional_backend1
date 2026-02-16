import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

export enum TipoReclamacao {
  RECLAMACAO = 'reclamacao',
  SUGESTAO = 'sugestao'
}

export enum StatusReclamacao {
  PENDENTE = 'pendente',
  EM_ANALISE = 'em_analise',
  RESOLVIDO = 'resolvido',
  REJEITADO = 'rejeitado'
}

@Entity('reclamacoes')
export class Reclamacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoReclamacao,
    default: TipoReclamacao.RECLAMACAO
  })
  tipo: TipoReclamacao;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusReclamacao,
    default: StatusReclamacao.PENDENTE
  })
  status: StatusReclamacao;

  @Column({ type: 'text', nullable: true })
  resposta_rh: string;

  @Column({ default: false })
  anonimo: boolean;

  @Column({ type: 'uuid', nullable: true })
  usuario_id: string;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @ManyToOne(() => Usuario, usuario => usuario.reclamacoes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
