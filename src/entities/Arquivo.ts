import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Usuario } from './Usuario';

export enum TipoArquivo {
  DOCUMENTO = 'documento',
  POLITICA = 'politica',
  MANUAL = 'manual',
  OUTRO = 'outro'
}

@Entity('arquivos')
export class Arquivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 255 })
  caminho: string;

  @Column({ length: 50 })
  extensao: string;

  @Column({ type: 'bigint' })
  tamanho: number;

  @Column({
    type: 'enum',
    enum: TipoArquivo,
    default: TipoArquivo.DOCUMENTO
  })
  tipo: TipoArquivo;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @Column({ type: 'uuid' })
  usuario_upload_id: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_upload_id' })
  usuario_upload: Usuario;

  @CreateDateColumn()
  criado_em: Date;
}
