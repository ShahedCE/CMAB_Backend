import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchiveEntity, ArchiveCategory } from '../../database/entities/archive.entity';
import { ArchiveQueryDto } from './dto/archive-query.dto';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectRepository(ArchiveEntity)
    private readonly archiveRepository: Repository<ArchiveEntity>,
  ) {}

  async create(
    dto: CreateArchiveDto,
    adminId: string,
    coverImageUrl?: string,
    fileUrl?: string,
    additionalImages?: string[],
  ): Promise<ArchiveEntity> {
    this.ensureValidId(adminId);

    // Process additional images if provided
    let imagesJson = dto.imagesJson;
    if (additionalImages && additionalImages.length > 0) {
      imagesJson = additionalImages.map((imageUrl) => ({
        imageUrl,
        caption: '',
        date: '',
      }));
    }

    const row = this.archiveRepository.create({
      title: dto.title.trim(),
      category: dto.category,
      division: dto.division?.trim(),
      year: dto.year?.trim(),
      date: dto.date ? new Date(dto.date) : null,
      description: dto.description?.trim(),
      caption: dto.caption?.trim(),
      coverImageUrl: coverImageUrl,
      fileUrl: fileUrl,
      imagesJson,
      membersJson: dto.membersJson,
      isPublished: dto.isPublished ?? true,
      createdByAdminId: adminId,
    });

    return this.archiveRepository.save(row);
  }

  async findAll(query: ArchiveQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.archiveRepository.createQueryBuilder('archive');

    // Apply filters
    if (query.category) {
      qb.andWhere('archive.category = :category', { category: query.category });
    }

    if (query.division?.trim()) {
      qb.andWhere('LOWER(archive.division) = LOWER(:division)', {
        division: query.division.trim(),
      });
    }

    if (query.year?.trim()) {
      qb.andWhere('archive.year = :year', { year: query.year.trim() });
    }

    if (query.isPublished !== undefined) {
      qb.andWhere('archive.isPublished = :isPublished', {
        isPublished: query.isPublished,
      });
    }

    if (query.search?.trim()) {
      qb.andWhere(
        `(
          LOWER(archive.title) LIKE LOWER(:search)
          OR LOWER(archive.description) LIKE LOWER(:search)
          OR LOWER(archive.caption) LIKE LOWER(:search)
        )`,
        { search: `%${query.search.trim()}%` },
      );
    }

    qb.orderBy('archive.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ArchiveEntity> {
    const row = await this.archiveRepository.findOne({ where: { id } });

    if (!row) {
      throw new NotFoundException(`Archive with ID ${id} not found`);
    }

    return row;
  }

  async update(
    id: string,
    dto: UpdateArchiveDto,
    adminId: string,
    coverImageUrl?: string,
    fileUrl?: string,
    additionalImages?: string[],
  ): Promise<ArchiveEntity> {
    this.ensureValidId(id);
    this.ensureValidId(adminId);

    const row = await this.archiveRepository.findOne({
      where: { id },
    });

    if (!row) {
      throw new NotFoundException('Archive not found');
    }

    // Update fields
    if (dto.title !== undefined) row.title = dto.title.trim();
    if (dto.category !== undefined) row.category = dto.category;
    if (dto.division !== undefined) row.division = dto.division?.trim();
    if (dto.year !== undefined) row.year = dto.year?.trim();
    if (dto.date !== undefined) row.date = dto.date ? new Date(dto.date) : null;
    if (dto.description !== undefined) row.description = dto.description?.trim();
    if (dto.caption !== undefined) row.caption = dto.caption?.trim();
    if (dto.isPublished !== undefined) row.isPublished = dto.isPublished;
    if (dto.imagesJson !== undefined) row.imagesJson = dto.imagesJson;
    if (dto.membersJson !== undefined) row.membersJson = dto.membersJson;

    // Update file URLs if provided
    if (coverImageUrl !== undefined) row.coverImageUrl = coverImageUrl;
    if (fileUrl !== undefined) row.fileUrl = fileUrl;

    // Process additional images if provided
    if (additionalImages && additionalImages.length > 0) {
      row.imagesJson = additionalImages.map((imageUrl) => ({
        imageUrl,
        caption: '',
        date: '',
      }));
    }

    return this.archiveRepository.save(row);
  }

  async remove(id: string) {
    const row = await this.findOne(id);

    await this.archiveRepository.remove(row);

    return {
      success: true,
      message: 'Archive deleted successfully',
    };
  }

  private ensureValidId(id: string): void {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Invalid id format');
    }
  }
}
