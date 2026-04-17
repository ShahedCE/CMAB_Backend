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
import { JoinRequestEntity } from './join-request.entity';

/**
 * Approved members directory: full snapshot of application data at sync time,
 * linked 1:1 to `join_requests` via `join_request_id`.
 */
@Entity({ name: 'members' })
@Index('idx_members_email', ['email'])
@Index('idx_members_join_request_id', ['joinRequestId'])
@Index('idx_members_created_at', ['createdAt'])
@Index('idx_members_is_active', ['isActive'])
export class MemberEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint', name: 'join_request_id', unique: true })
  joinRequestId!: string;

  @ManyToOne(() => JoinRequestEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'join_request_id' })
  joinRequest!: JoinRequestEntity;

  @Column({ type: 'varchar', length: 160, name: 'full_name_bn' })
  fullNameBn!: string;

  @Column({ type: 'varchar', length: 160, name: 'full_name_en' })
  fullNameEn!: string;

  @Column({ type: 'varchar', length: 160, name: 'father_name' })
  fatherName!: string;

  @Column({ type: 'varchar', length: 160, name: 'mother_name' })
  motherName!: string;

  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth!: string;

  @Column({ type: 'varchar', length: 50, name: 'national_id' })
  nationalId!: string;

  @Column({ type: 'varchar', length: 50, name: 'medical_reg_no' })
  medicalRegNo!: string;

  @Column({ type: 'varchar', length: 50, name: 'membership_type' })
  membershipType!: string;

  @Column({ type: 'varchar', length: 190 })
  email!: string;

  @Column({ type: 'varchar', length: 30 })
  mobile!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 120, name: 'present_village' })
  presentVillage!: string;

  @Column({ type: 'varchar', length: 120, name: 'present_post' })
  presentPost!: string;

  @Column({ type: 'varchar', length: 120, name: 'present_thana' })
  presentThana!: string;

  @Column({ type: 'varchar', length: 120, name: 'present_district' })
  presentDistrict!: string;

  @Column({ type: 'varchar', length: 120, name: 'permanent_village' })
  permanentVillage!: string;

  @Column({ type: 'varchar', length: 120, name: 'permanent_post' })
  permanentPost!: string;

  @Column({ type: 'varchar', length: 120, name: 'permanent_thana' })
  permanentThana!: string;

  @Column({ type: 'varchar', length: 120, name: 'permanent_district' })
  permanentDistrict!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  specialty!: string | null;

  @Column({ type: 'jsonb', name: 'education_entries' })
  educationEntries!: unknown[];

  @Column({ type: 'jsonb', name: 'workplace_types' })
  workplaceTypes!: unknown[];

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'entry_fee', default: 0 })
  entryFee!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'annual_fee', default: 0 })
  annualFee!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'lifetime_fee',
    default: 0,
  })
  lifetimeFee!: string;

  @Column({ type: 'boolean', name: 'declaration_accepted' })
  declarationAccepted!: boolean;

  @Column({ type: 'text' })
  notes!: string;

  @Column({ type: 'text', name: 'profile_image_url', nullable: true })
  profileImageUrl!: string | null;

  @Column({ type: 'timestamptz', name: 'approved_at' })
  approvedAt!: Date;

  @Column({ type: 'bigint', name: 'approved_by_admin_id', nullable: true })
  approvedByAdminId!: string | null;

  @ManyToOne(() => AdminEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'approved_by_admin_id' })
  approvedByAdmin!: AdminEntity | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

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
