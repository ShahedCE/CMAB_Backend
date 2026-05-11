import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '../../database/entities/message.entity';
import { MessageQueryDto } from './dto/message-query.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(dto: CreateMessageDto): Promise<MessageEntity> {
    const row = this.messageRepository.create({
      organizationName: dto.organizationName.trim(),
      fatherName: dto.fatherName.trim(),
      message: dto.message.trim(),
    });

    return this.messageRepository.save(row);
  }

  async findAll(query: MessageQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.messageRepository.createQueryBuilder('message');

    // Apply search filters
    if (query.search?.trim()) {
      qb.andWhere(
        `(
          LOWER(message.organizationName) LIKE LOWER(:search)
          OR LOWER(message.fatherName) LIKE LOWER(:search)
          OR LOWER(message.message) LIKE LOWER(:search)
        )`,
        { search: `%${query.search.trim()}%` },
      );
    }

    qb.orderBy('message.createdAt', 'DESC')
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

  async findOne(id: string): Promise<MessageEntity> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Invalid id format');
    }

    const row = await this.messageRepository.findOne({
      where: { id },
    });

    if (!row) {
      throw new NotFoundException('Message not found');
    }

    return row;
  }

  async update(id: string, dto: UpdateMessageDto): Promise<MessageEntity> {
    const row = await this.findOne(id);

    if (dto.organizationName !== undefined) row.organizationName = dto.organizationName.trim();
    if (dto.fatherName !== undefined) row.fatherName = dto.fatherName.trim();
    if (dto.message !== undefined) row.message = dto.message.trim();

    return this.messageRepository.save(row);
  }

  async remove(id: string) {
    const row = await this.findOne(id);

    await this.messageRepository.remove(row);

    return {
      success: true,
      message: 'Message deleted successfully',
    };
  }
}
