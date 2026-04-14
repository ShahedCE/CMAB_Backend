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

@Entity({ name: 'admin_otp_codes' })
@Index('idx_admin_otp_codes_email', ['email'])
@Index('idx_admin_otp_codes_created_at', ['createdAt'])
export class AdminOtpCodeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint', name: 'admin_id' })
  adminId!: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.otpCodes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin!: AdminEntity;

  @Column({ type: 'varchar', length: 190 })
  email!: string;

  @Column({ type: 'text', name: 'otp_code_hash' })
  otpCodeHash!: string;

  @Column({ type: 'varchar', length: 40, default: 'forgot_password' })
  purpose!: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz', name: 'used_at', nullable: true })
  usedAt!: Date | null;

  @Column({ type: 'int', name: 'attempt_count', default: 0 })
  attemptCount!: number;

  @Column({ type: 'int', name: 'max_attempt', default: 5 })
  maxAttempt!: number;

  @Column({ type: 'inet', name: 'requested_ip', nullable: true })
  requestedIp!: string | null;

  @Column({ type: 'text', name: 'requested_user_agent', nullable: true })
  requestedUserAgent!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @BeforeInsert()
  private setCreatedAt(): void {
    this.createdAt = new Date();
  }
}
