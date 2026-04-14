import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity({ name: 'notifications' })
@Index('idx_notifications_created_at', ['createdAt'])
export class NotificationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint', name: 'admin_id', nullable: true })
  adminId!: string | null;

  @ManyToOne(() => AdminEntity, (admin) => admin.notifications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'admin_id' })
  admin!: AdminEntity | null;

  @Column({ type: 'varchar', length: 40 })
  type!: string;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  body!: string | null;

  @Column({ type: 'varchar', length: 40, name: 'source_type' })
  sourceType!: string;

  @Column({ type: 'bigint', name: 'source_id', nullable: true })
  sourceId!: string | null;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  meta!: Record<string, unknown>;

  @Column({ type: 'boolean', name: 'is_read', default: false })
  isRead!: boolean;

  @Column({ type: 'timestamptz', name: 'read_at', nullable: true })
  readAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @BeforeInsert()
  private setCreatedAt(): void {
    this.createdAt = new Date();
  }
}
