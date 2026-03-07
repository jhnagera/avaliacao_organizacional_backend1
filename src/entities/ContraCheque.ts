import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Usuario } from './Usuario';

@Entity('contracheques')
export class ContraCheque {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  mes: number;

  @Column({ type: 'int' })
  ano: number;

  @Column({ length: 255 })
  arquivo_url: string;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @Column({ type: 'uuid' })
  usuario_id: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn()
  criado_em: Date;
}
