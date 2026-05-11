import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExecutiveMemberEntity } from '../../database/entities/executive-member.entity';
import { ExecutiveMemberQueryDto } from './dto/executive-member-query.dto';
import { CreateExecutiveMemberDto } from './dto/create-executive-member.dto';
import { UpdateExecutiveMemberDto } from './dto/update-executive-member.dto';

@Injectable()
export class ExecutiveMembersService {
  constructor(
    @InjectRepository(ExecutiveMemberEntity)
    private readonly executiveMemberRepository: Repository<ExecutiveMemberEntity>,
  ) {}

  async create(dto: CreateExecutiveMemberDto): Promise<ExecutiveMemberEntity> {
    const row = this.executiveMemberRepository.create({
      name: dto.name.trim(),
      designation: dto.designation.trim(),
      phone: dto.phone?.trim() || null,
      email: dto.email?.trim() || null,
      imageUrl: dto.imageUrl?.trim() || null,
      isActive: dto.isActive ?? true,
    });

    return this.executiveMemberRepository.save(row);
  }

  async findAll(query: ExecutiveMemberQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.executiveMemberRepository.createQueryBuilder('executiveMember');

    // Apply search filters
    if (query.search?.trim()) {
      qb.andWhere(
        `(
          LOWER(executiveMember.name) LIKE LOWER(:search)
          OR LOWER(executiveMember.designation) LIKE LOWER(:search)
          OR LOWER(executiveMember.phone) LIKE LOWER(:search)
          OR LOWER(executiveMember.email) LIKE LOWER(:search)
        )`,
        { search: `%${query.search.trim()}%` },
      );
    }

    // Apply specific field filters
    if (query.name?.trim()) {
      qb.andWhere('LOWER(executiveMember.name) LIKE LOWER(:name)', {
        name: `%${query.name.trim()}%`,
      });
    }

    if (query.designation?.trim()) {
      qb.andWhere('LOWER(executiveMember.designation) LIKE LOWER(:designation)', {
        designation: `%${query.designation.trim()}%`,
      });
    }

    if (query.phone?.trim()) {
      qb.andWhere('LOWER(executiveMember.phone) LIKE LOWER(:phone)', {
        phone: `%${query.phone.trim()}%`,
      });
    }

    if (query.email?.trim()) {
      qb.andWhere('LOWER(executiveMember.email) LIKE LOWER(:email)', {
        email: `%${query.email.trim()}%`,
      });
    }

    if (query.isActive !== undefined) {
      qb.andWhere('executiveMember.isActive = :isActive', { isActive: query.isActive });
    }

    qb.orderBy('executiveMember.createdAt', 'DESC')
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

  async findOne(id: string): Promise<ExecutiveMemberEntity> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Invalid id format');
    }

    const row = await this.executiveMemberRepository.findOne({
      where: { id },
    });

    if (!row) {
      throw new NotFoundException('Executive member not found');
    }

    return row;
  }

  async update(id: string, dto: UpdateExecutiveMemberDto): Promise<ExecutiveMemberEntity> {
    const row = await this.findOne(id);

    if (dto.name !== undefined) row.name = dto.name.trim();
    if (dto.designation !== undefined) row.designation = dto.designation.trim();
    if (dto.phone !== undefined) row.phone = dto.phone?.trim() || null;
    if (dto.email !== undefined) row.email = dto.email?.trim() || null;
    if (dto.imageUrl !== undefined) row.imageUrl = dto.imageUrl?.trim() || null;
    if (dto.isActive !== undefined) row.isActive = dto.isActive;

    return this.executiveMemberRepository.save(row);
  }

  async remove(id: string) {
    const row = await this.findOne(id);

    await this.executiveMemberRepository.remove(row);

    return {
      success: true,
      message: 'Executive member deleted successfully',
    };
  }
}
