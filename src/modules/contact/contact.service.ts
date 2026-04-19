import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessageEntity } from '../../database/entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactListQueryDto } from './dto/contact-list-quiry.dto';

export type ContactCreatedPayload = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly contactRepository: Repository<ContactMessageEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateContactDto) {
    const row = this.contactRepository.create({
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      message: dto.message.trim(),
      status: 'unread',
      repliedByAdminId: null,
      repliedAt: null,
    });

    await this.contactRepository.save(row);

    const payload: ContactCreatedPayload = {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt,
    };

    this.eventEmitter.emit('contact.created', payload);

    return {
      id: row.id,
      message: 'Thank you. Your message was received.',
    };
  }

  //admin services 
   async findAll(query: ContactListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.contactRepository.createQueryBuilder('contact');

    if (query.search) {
      qb.andWhere(
        `
        LOWER(contact.name) LIKE LOWER(:search)
        OR LOWER(contact.email) LIKE LOWER(:search)
        OR LOWER(contact.message) LIKE LOWER(:search)
        `,
        { search: `%${query.search}%` },
      );
    }

    if (query.status) {
      qb.andWhere('contact.status = :status', { status: query.status });
    }

    qb.orderBy('contact.createdAt', 'DESC')
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

  async findOne(id: string) {
    const row = await this.contactRepository.findOne({
      where: { id },
      relations: ['repliedByAdmin'],
    });

    if (!row) {
      throw new NotFoundException('Contact message not found');
    }

    return row;
  }

  async markAsRead(id: string) {
  const row = await this.contactRepository.findOne({
    where: { id },
  });

  if (!row) {
    throw new NotFoundException('Contact message not found');
  }

  if (row.status === 'unread') {
    row.status = 'read';
    await this.contactRepository.save(row);
  }

  return {
    id: row.id,
    status: row.status,
    message: 'Contact message marked as read',
  };
}

}
