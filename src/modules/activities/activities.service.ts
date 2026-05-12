import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from '../../database/entities/activity.entity';
import { ActivityListQueryDto } from './dto/activity-list-query.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
  ) {}

async create(
  dto: CreateActivityDto,
  adminId: string,
  imageUrl: string | null,
  imageUrls: string[] = [],
): Promise<ActivityEntity> {

  this.ensureNumericId(adminId);

  const row = this.activityRepository.create({
    title: dto.title.trim(),
    description: dto.description.trim(),
    fullDescription: dto.fullDescription.trim(),
    image: imageUrl,   // first image as primary
    images: imageUrls.length > 0 ? imageUrls : null, // all images array
    date: dto.date,
    createdByAdminId: adminId,
  });

  return this.activityRepository.save(row);
}
  async findAll(query: ActivityListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.activityRepository.createQueryBuilder('activity');

    if (query.search?.trim()) {
      qb.andWhere(
        `(
          LOWER(activity.title) LIKE LOWER(:search)
          OR LOWER(activity.description) LIKE LOWER(:search)
          OR LOWER(activity.fullDescription) LIKE LOWER(:search)
        )`,
        { search: `%${query.search.trim()}%` },
      );
    }

    qb.orderBy('activity.date', 'DESC')
      .addOrderBy('activity.createdAt', 'DESC')
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

  async findOne(id: string): Promise<ActivityEntity> {
    this.ensureNumericId(id);

    const row = await this.activityRepository.findOne({
      where: { id },
      relations: ['createdByAdmin'],
    });

    if (!row) {
      throw new NotFoundException('Activity not found');
    }

    return row;
  }

 async update(
  id: string,
  dto: UpdateActivityDto,
  adminId: string,
  imageUrl?: string,
  imageUrls: string[] = [],
): Promise<ActivityEntity> {
  this.ensureNumericId(id);
  this.ensureNumericId(adminId);

  const row = await this.activityRepository.findOne({
    where: { id },
  });

  if (!row) {
    throw new NotFoundException('Activity not found');
  }

  row.title = dto.title?.trim() ?? row.title;
  row.description = dto.description?.trim() ?? row.description;
  row.fullDescription = dto.fullDescription?.trim() ?? row.fullDescription;
  row.date = dto.date ?? row.date;

  if (imageUrl !== undefined) {
    row.image = imageUrl;
  }

  if (imageUrls.length > 0) {
    row.images = imageUrls;
  }

  // Handle individual image updates from DTO
  if (dto.image !== undefined) {
    row.image = dto.image;
  }

  if (dto.images !== undefined) {
    row.images = dto.images;
  }

  return this.activityRepository.save(row);
}


  async remove(id: string) {
    const row = await this.findOne(id);

    await this.activityRepository.remove(row);

    return {
      success: true,
      message: 'Activity deleted successfully',
    };
  }

  private ensureNumericId(id: string): void {
    if (!/^\d+$/.test(id)) {
      throw new BadRequestException('Invalid id format');
    }
  }
}