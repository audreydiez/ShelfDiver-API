import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstname: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastname: string

  @Column({ type: 'varchar', length: 15, nullable: false })
  role: string

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date

  @Column({ type: 'int', nullable: false })
  created_by: number

  @CreateDateColumn({ type: 'datetime' })
  updated_at: Date

  @Column({ type: 'int', nullable: true })
  updated_by: number
}
