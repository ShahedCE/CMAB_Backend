import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinRequestEntity } from './join-request.entity';
import { ContactMessageEntity } from './contact-message.entity';
import { NotificationEntity } from './notification.entity';
import { AdminOtpCodeEntity } from './admin-otp-code.entity';
import { AdminPasswordResetLogEntity } from './admin-password-reset-log.entity';
import { ActivityEntity } from './activity.entity';

@Entity({ name: 'admins' })
@Index('idx_admins_email', ['email']) //
export class AdminEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 190, unique: true })
  email!: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 30, default: 'admin' })
  role!: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamptz', name: 'last_login_at', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => JoinRequestEntity, (joinRequest) => joinRequest.reviewedByAdmin)
  reviewedJoinRequests!: JoinRequestEntity[];

  @OneToMany(
    () => ContactMessageEntity,
    (contactMessage) => contactMessage.repliedByAdmin,
  )
  repliedContactMessages!: ContactMessageEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.admin)
  notifications!: NotificationEntity[];

  @OneToMany(() => AdminOtpCodeEntity, (otpCode) => otpCode.admin)
  otpCodes!: AdminOtpCodeEntity[];

  @OneToMany(
    () => AdminPasswordResetLogEntity,
    (passwordResetLog) => passwordResetLog.admin,
  )
  passwordResetLogs!: AdminPasswordResetLogEntity[];
  //admin activities
  @OneToMany(() => ActivityEntity, (activity) => activity.createdByAdmin)
activities!: ActivityEntity[];

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
