import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Empresa } from './Empresa';
import { Departamento } from './Departamento';
import { RespostaQuestionario } from './RespostaQuestionario';
import { Reclamacao } from './Reclamacao';
import { Denuncia } from './Denuncia';

export enum TipoUsuario {
  ADMIN = 'admin',
  RH = 'rh',
  COLABORADOR = 'colaborador',
  SUPER_ADMIN = 'super_admin'
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  nome: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  senha: string;

  @Column({ length: 14, nullable: true })
  cpf: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ length: 100, nullable: true })
  cargo: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.COLABORADOR
  })
  tipo: TipoUsuario;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @Column({ type: 'uuid', nullable: true })
  departamento_id: string;

  @ManyToOne(() => Empresa, empresa => empresa.usuarios)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => Departamento, departamento => departamento.usuarios)
  @JoinColumn({ name: 'departamento_id' })
  departamento: Departamento;

  @OneToMany(() => RespostaQuestionario, resposta => resposta.usuario)
  respostas: RespostaQuestionario[];

  @OneToMany(() => Reclamacao, reclamacao => reclamacao.usuario)
  reclamacoes: Reclamacao[];

  @OneToMany(() => Denuncia, denuncia => denuncia.usuario)
  denuncias: Denuncia[];

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.senha && !this.senha.startsWith('$2a$')) {
      this.senha = await bcrypt.hash(this.senha, 10);
    }
  }

  async validatePassword(senha: string): Promise<boolean> {
    return bcrypt.compare(senha, this.senha);
  }
}
