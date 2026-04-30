import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("contacts")
export class Contact {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  // 👤 Personal Info
  @Column({ type: "varchar", length: 100 })
  firstName!: string;

  @Column({ type: "varchar", length: 100 })
  lastName!: string;

  @Column({ type: "varchar", length: 150 })
  email!: string;

  @Column({ type: "varchar", length: 50 })
  phone!: string;

  // 📍 Address (Dutch format)
@Column({ type: 'varchar', length: 20, default: '' })
postcode!: string;

  @Column({ type: "varchar", length: 150 })
  straat!: string;

  @Column({ type: "varchar", length: 20 })
  nr!: string;



  @Column({ type: "varchar", length: 100 })
  plaats!: string;

  // 📐 Project info
  @Column({ type: "float" })
  space!: number;

  @Column({ type: "text" })
  message!: string;

  // 🖼️ Images
  @Column({ type: "simple-array", nullable: true })
  images!: string[];

  // 📊 System fields
  @Column({ type: "boolean", default: false })
  isRead!: boolean;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: string;

  // ⏱ timestamps
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}