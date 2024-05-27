import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Users } from '../users/users.entity'

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, nullable: false })
  brand: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  model: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  vehicle_type: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string

  @Column({ type: 'decimal', nullable: false })
  price: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  motor_type: string

  @Column({ type: 'varchar', length: 50, nullable: false })
  energy: string

  @Column({ type: 'varchar', length: 50, nullable: false })
  transmission: string

  @Column({ type: 'int', nullable: true })
  power: number

  @Column({ type: 'int', nullable: true })
  fiscal_power: number

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date

  @ManyToOne(() => Users, (product) => product.created_by)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'product_user_id',
  })
  created_by: Users

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date

  @ManyToOne(() => Users, (product) => product.updated_by)
  @JoinColumn({
    name: 'updated_by',
    foreignKeyConstraintName: 'product_user_id_2',
  })
  updated_by: Users
}
