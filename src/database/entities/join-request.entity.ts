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

@Entity({ name: 'join_requests' })
@Check(
  'chk_join_requests_status',
  `"status" IN ('pending', 'approved', 'rejected')`,
)

@Index('idx_join_requests_email', ['email'])
@Index('idx_join_requests_status', ['status'])
@Index('idx_join_requests_created_at', ['createdAt'])
export class JoinRequestEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

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

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'bigint', name: 'reviewed_by_admin_id', nullable: true })
  reviewedByAdminId!: string | null;

  @ManyToOne(() => AdminEntity, (admin) => admin.reviewedJoinRequests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reviewed_by_admin_id' })
  reviewedByAdmin!: AdminEntity | null;

  @Column({ type: 'timestamptz', name: 'reviewed_at', nullable: true })
  reviewedAt!: Date | null;

  @Column({ type: 'text', name: 'rejection_reason', nullable: true })
  rejectionReason!: string | null;

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
