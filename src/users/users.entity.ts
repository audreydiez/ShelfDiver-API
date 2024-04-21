import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstname: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastname: string

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    default: 'CONTRIBUTOR',
  })
  role: string

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date

  @ManyToOne(() => Users, (user) => user.created_by)
  @JoinColumn({ name: 'created_by', foreignKeyConstraintName: 'user_id' })
  created_by: Users

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date

  @ManyToOne(() => Users, (user) => user.updated_by)
  @JoinColumn({ name: 'updated_by', foreignKeyConstraintName: 'user_id_2' })
  updated_by: Users
}
