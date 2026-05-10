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

export enum ArchiveCategory {
  SOUVENIR = 'souvenir',
  COMMITTEE = 'committee',
  PHOTO_ALBUM = 'photo_album',
}

@Entity({ name: 'archives' })
@Index('idx_archives_category', ['category'])
@Index('idx_archives_division', ['division'])
@Index('idx_archives_year', ['year'])
@Index('idx_archives_created_at', ['createdAt'])
export class ArchiveEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 300 })
  title!: string;

  @Column({
    type: 'enum',
    enum: ArchiveCategory,
    default: ArchiveCategory.SOUVENIR,
  })
  category!: ArchiveCategory;

  @Column({ type: 'varchar', length: 100, nullable: true })
  division?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  year?: string | null;

  @Column({ type: 'date', nullable: true })
  date?: Date | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  caption?: string | null;

  @Column({ type: 'text', name: 'cover_image_url', nullable: true })
  coverImageUrl?: string | null;

  @Column({ type: 'text', name: 'file_url', nullable: true })
  fileUrl?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  imagesJson?: any[] | null;

  @Column({ type: 'jsonb', nullable: true })
  membersJson?: any[] | null;

  @Column({ type: 'boolean', name: 'is_published', default: true })
  isPublished!: boolean;

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
