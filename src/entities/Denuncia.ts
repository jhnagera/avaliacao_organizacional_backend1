import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

export enum CategoriaDenuncia {
  ASSEDIO = 'assedio',
  DISCRIMINACAO = 'discriminacao',
  CORRUPCAO = 'corrupcao',
  VIOLACAO_CODIGO = 'violacao_codigo',
  OUTRO = 'outro'
}

export enum StatusDenuncia {
  PENDENTE = 'pendente',
  EM_INVESTIGACAO = 'em_investigacao',
  CONCLUIDO = 'concluido',
  ARQUIVADO = 'arquivado'
}

@Entity('denuncias')
export class Denuncia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CategoriaDenuncia
  })
  categoria: CategoriaDenuncia;

  @Column({ type: 'text' })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusDenuncia,
    default: StatusDenuncia.PENDENTE
  })
  status: StatusDenuncia;

  @Column({ type: 'text', nullable: true })
  observacoes_internas: string;

  @Column({ default: true })
  anonimo: boolean;

  @Column({ type: 'uuid', nullable: true })
  usuario_id: string;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @ManyToOne(() => Usuario, usuario => usuario.denuncias)
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
