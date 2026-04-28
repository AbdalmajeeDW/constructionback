import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  phone!: string;

  @Column({ type: 'varchar', length: 200 })
  location!: string;

  @Column({ type: 'varchar', length: 50, name: 'house_number' })
  houseNumber!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'text' })
  space!: string;

  @Column({ type: 'boolean' })
  isRead!: boolean;

  @Column({ type: 'simple-array', nullable: true })
  images!: string[];

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
