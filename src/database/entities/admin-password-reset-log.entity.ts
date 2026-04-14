import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { AdminOtpCodeEntity } from './admin-otp-code.entity';

@Entity({ name: 'admin_password_reset_logs' })
@Check(
  'chk_admin_password_reset_logs_status',
  `"status" IN ('success', 'failed')`,
)
@Index('idx_admin_password_reset_logs_email', ['email'])
@Index('idx_admin_password_reset_logs_status', ['status'])
@Index('idx_admin_password_reset_logs_created_at', ['createdAt'])
export class AdminPasswordResetLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint', name: 'admin_id' })
  adminId!: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.passwordResetLogs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin!: AdminEntity;

  @Column({ type: 'varchar', length: 190 })
  email!: string;

  @Column({ type: 'varchar', length: 30, name: 'reset_method', default: 'otp' })
  resetMethod!: string;

  @Column({ type: 'bigint', name: 'otp_code_id', nullable: true })
  otpCodeId!: string | null;

  @ManyToOne(() => AdminOtpCodeEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'otp_code_id' })
  otpCode!: AdminOtpCodeEntity | null;

  @Column({ type: 'varchar', length: 20 })
  status!: 'success' | 'failed';

  @Column({ type: 'text', nullable: true })
  reason!: string | null;

  @Column({ type: 'inet', name: 'ip_address', nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'text', name: 'user_agent', nullable: true })
  userAgent!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @BeforeInsert()
  private setCreatedAt(): void {
    this.createdAt = new Date();
  }
}
