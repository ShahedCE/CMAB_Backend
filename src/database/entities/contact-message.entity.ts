import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity({ name: 'contact_messages' })
@Check(
  'chk_contact_messages_status',
  `"status" IN ('unread', 'read', 'replied')`,
)
@Index('idx_contact_messages_email', ['email'])
@Index('idx_contact_messages_status', ['status'])
@Index('idx_contact_messages_created_at', ['createdAt'])
export class ContactMessageEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 190 })
  email!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', length: 20, default: 'unread' })
  status!: 'unread' | 'read' | 'replied';

  @Column({ type: 'bigint', name: 'replied_by_admin_id', nullable: true })
  repliedByAdminId!: string | null;

  @ManyToOne(() => AdminEntity, (admin) => admin.repliedContactMessages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'replied_by_admin_id' })
  repliedByAdmin!: AdminEntity | null;

  @Column({ type: 'timestamptz', name: 'replied_at', nullable: true })
  repliedAt!: Date | null;

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
