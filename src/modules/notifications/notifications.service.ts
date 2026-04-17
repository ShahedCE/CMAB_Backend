import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../database/entities/notification.entity';
import type { ContactCreatedPayload } from '../contact/contact.service';
import type {
  DirectoryMemberAddedPayload,
  DirectoryMemberUpdatedPayload,
  JoinRequestCreatedPayload,
  JoinRequestDeletedPayload,
  JoinRequestUpdatedPayload,
} from '../members/members.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  @OnEvent('contact.created')
  async handleContactCreated(payload: ContactCreatedPayload): Promise<void> {
    const row = this.notificationRepository.create({
      adminId: null,
      type: 'contact',
      title: 'New contact form submission',
      body: `${payload.name} (${payload.email})`,
      sourceType: 'contact_message',
      sourceId: payload.id,
      meta: {
        name: payload.name,
        email: payload.email,
        createdAt: payload.createdAt.toISOString(),
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('join_request.created')
  async handleJoinRequestCreated(
    payload: JoinRequestCreatedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
      adminId: null,
      type: 'join_request',
      title: 'New membership application',
      body: `${payload.fullNameEn} (${payload.email})`,
      sourceType: 'join_request',
      sourceId: payload.id,
      meta: {
        fullNameEn: payload.fullNameEn,
        email: payload.email,
        createdAt: payload.createdAt.toISOString(),
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('join_request.updated')
  async handleJoinRequestUpdated(
    payload: JoinRequestUpdatedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
      adminId: null,
      type: 'join_request',
      title: 'Membership application updated',
      body: `${payload.fullNameEn} (${payload.email})`,
      sourceType: 'join_request',
      sourceId: payload.id,
      meta: {
        fullNameEn: payload.fullNameEn,
        email: payload.email,
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('join_request.deleted')
  async handleJoinRequestDeleted(
    payload: JoinRequestDeletedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
      adminId: null,
      type: 'join_request',
      title: 'Membership application deleted',
      body: `${payload.fullNameEn} (${payload.email})`,
      sourceType: 'join_request',
      sourceId: payload.id,
      meta: {
        fullNameEn: payload.fullNameEn,
        email: payload.email,
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('directory.member.added')
  async handleDirectoryMemberAdded(
    payload: DirectoryMemberAddedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
      adminId: null,
      type: 'member',
      title: 'Member approved (directory)',
      body: `${payload.fullNameEn} (${payload.email})`,
      sourceType: 'member',
      sourceId: payload.memberId,
      meta: {
        joinRequestId: payload.joinRequestId,
        fullNameEn: payload.fullNameEn,
        email: payload.email,
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('directory.member.updated')
  async handleDirectoryMemberUpdated(
    payload: DirectoryMemberUpdatedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
      adminId: null,
      type: 'member',
      title: 'Member directory updated',
      body: `${payload.fullNameEn} (${payload.email})`,
      sourceType: 'member',
      sourceId: payload.memberId,
      meta: {
        joinRequestId: payload.joinRequestId,
        fullNameEn: payload.fullNameEn,
        email: payload.email,
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }
}
