import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../database/entities/notification.entity';

import type {
  JoinRequestApprovedPayload,
  JoinRequestCreatedPayload,
  JoinRequestRejectedPayload,
} from '../join-requests/join-request.events';

import type {
  DirectoryMemberAddedPayload,
  DirectoryMemberDeletedPayload,
  DirectoryMemberUpdatedPayload,
} from '../members/member.events';

import type { ContactCreatedPayload } from '../contact/contact.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  // =====================================================
  // 🔔 EVENT HANDLERS (AUTO CREATE NOTIFICATIONS)
  // =====================================================

  @OnEvent('join_request.created')
  async handleJoinRequestCreated(
    payload: JoinRequestCreatedPayload,
  ) {
    await this.repo.save(
      this.repo.create({
        adminId: null,
        type: 'join_request',
        title: 'New membership application',
        body: `${payload.fullNameEn} (${payload.email})`,
        sourceType: 'join_request',
        sourceId: payload.joinRequestId,
        meta: {
          joinRequestId: payload.joinRequestId,
          fullNameEn: payload.fullNameEn,
          email: payload.email,
          createdAt: payload.createdAt.toISOString(),
        },
        isRead: false,
        readAt: null,
      }),
    );
  }

  @OnEvent('join_request.approved')
  async handleJoinRequestApproved(
    payload: JoinRequestApprovedPayload,
  ) {
    await this.repo.save(
      this.repo.create({
        adminId: payload.approvedByAdminId,
        type: 'join_request',
        title: 'Membership application approved',
        body: `${payload.fullNameEn} (${payload.email})`,
        sourceType: 'join_request',
        sourceId: payload.joinRequestId,
        meta: {
          joinRequestId: payload.joinRequestId,
          memberId: payload.memberId,
          fullNameEn: payload.fullNameEn,
          email: payload.email,
          approvedAt: payload.approvedAt.toISOString(),
          approvedByAdminId: payload.approvedByAdminId,
        },
        isRead: false,
        readAt: null,
      }),
    );
  }

  @OnEvent('join_request.rejected')
  async handleJoinRequestRejected(
    payload: JoinRequestRejectedPayload,
  ) {
    await this.repo.save(
      this.repo.create({
        adminId: null,
        type: 'join_request',
        title: 'Membership application rejected',
        body: `${payload.fullNameEn} (${payload.email})`,
        sourceType: 'join_request',
        sourceId: payload.joinRequestId,
        meta: {
          joinRequestId: payload.joinRequestId,
          fullNameEn: payload.fullNameEn,
          email: payload.email,
          rejectedAt: payload.rejectedAt.toISOString(),
          reason: payload.reason,
        },
        isRead: false,
        readAt: null,
      }),
    );
  }

  @OnEvent('directory.member.added')
  async handleDirectoryMemberAdded(
    payload: DirectoryMemberAddedPayload,
  ) {
    await this.repo.save(
      this.repo.create({
        adminId: null,
        type: 'member',
        title: 'Member added to directory',
        body: `${payload.fullNameEn} (${payload.email})`,
        sourceType: 'member',
        sourceId: payload.memberId,
        meta: {
          memberId: payload.memberId,
          joinRequestId: payload.joinRequestId,
          fullNameEn: payload.fullNameEn,
          email: payload.email,
        },
        isRead: false,
        readAt: null,
      }),
    );
  }

  @OnEvent('directory.member.updated')
  async handleDirectoryMemberUpdated(
    payload: DirectoryMemberUpdatedPayload,
  ) {
    await this.repo.save(
      this.repo.create({
        adminId: null,
        type: 'member',
        title: 'Member directory updated',
        body: `${payload.fullNameEn} (${payload.email})`,
        sourceType: 'member',
        sourceId: payload.memberId,
        meta: {
          memberId: payload.memberId,
          joinRequestId: payload.joinRequestId,
          fullNameEn: payload.fullNameEn,
          email: payload.email,
        },
        isRead: false,
        readAt: null,
      }),
    );
  }

  @OnEvent('directory.member.deleted')
  async handleDirectoryMemberDeleted(
    payload: DirectoryMemberDeletedPayload,
  ) {
    await this.repo.save(
      this.repo.create({
        adminId: null,
        type: 'member',
        title: 'Member removed from directory',
        body: `${payload.fullNameEn} (${payload.email})`,
        sourceType: 'member',
        sourceId: payload.memberId,
        meta: {
          memberId: payload.memberId,
          joinRequestId: payload.joinRequestId,
          fullNameEn: payload.fullNameEn,
          email: payload.email,
        },
        isRead: false,
        readAt: null,
      }),
    );
  }

  @OnEvent('contact.created')
  async handleContactCreated(payload: ContactCreatedPayload) {
    await this.repo.save(
      this.repo.create({
        adminId: null,
        type: 'contact',
        title: 'New contact message received',
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
      }),
    );
  }

  // =====================================================
  // 📡 API METHODS
  // =====================================================

  // GET /notifications
  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET /notifications/unread-count
  async getUnreadCount() {
    const count = await this.repo.count({
      where: { isRead: false },
    });

    return { count };
  }

  // PATCH /notifications/:id/read
  async markAsRead(id: string) {
    const row = await this.repo.findOne({ where: { id } });

    if (!row) {
      throw new NotFoundException('Notification not found');
    }

    if (!row.isRead) {
      row.isRead = true;
      row.readAt = new Date();
      await this.repo.save(row);
    }

    return {
      message: 'Notification marked as read',
      data: row,
    };
  }
}