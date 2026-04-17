import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessageEntity } from '../../database/entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';

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
}
