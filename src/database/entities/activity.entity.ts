import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity({ name: 'activities' })
@Index('idx_activities_date', ['date'])
@Index('idx_activities_created_at', ['createdAt'])
export class ActivityEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', name: 'full_description' })
  fullDescription!: string;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  image!: string | null;

  @Column({ type: 'jsonb', name: 'images', nullable: true })
  images!: string[] | null;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'bigint', name: 'created_by_admin_id', nullable: true })
  createdByAdminId!: string | null;

  @ManyToOne(() => AdminEntity, (admin) => admin.activities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_admin_id' })
  createdByAdmin!: AdminEntity | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  private setCreatedAt(): void {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  private setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}