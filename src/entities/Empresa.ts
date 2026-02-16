import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';
import { Departamento } from './Departamento';
import { Questionario } from './Questionario';
import { Aviso } from './Aviso';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  nome: string;

  @Column({ length: 18, unique: true })
  cnpj: string;

  @Column({ length: 100, nullable: true })
  razao_social: string;

  @Column({ type: 'text', nullable: true })
  endereco: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @OneToMany(() => Usuario, usuario => usuario.empresa)
  usuarios: Usuario[];

  @OneToMany(() => Departamento, departamento => departamento.empresa)
  departamentos: Departamento[];

  @OneToMany(() => Questionario, questionario => questionario.empresa)
  questionarios: Questionario[];

  @OneToMany(() => Aviso, aviso => aviso.empresa)
  avisos: Aviso[];
}
