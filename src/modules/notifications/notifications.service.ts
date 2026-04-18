import { Injectable } from '@nestjs/common';
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

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

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
      sourceId: payload.joinRequestId,
      meta: {
        joinRequestId: payload.joinRequestId,
        fullNameEn: payload.fullNameEn,
        email: payload.email,
        createdAt: payload.createdAt.toISOString(),
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('join_request.approved')
  async handleJoinRequestApproved(
    payload: JoinRequestApprovedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
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
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('join_request.rejected')
  async handleJoinRequestRejected(
    payload: JoinRequestRejectedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
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
        memberId: payload.memberId,
        joinRequestId: payload.joinRequestId,
        fullNameEn: payload.fullNameEn,
        email: payload.email,
      },
      isRead: false,
      readAt: null,
    });

    await this.notificationRepository.save(row);
  }

  @OnEvent('directory.member.deleted')
  async handleDirectoryMemberDeleted(
    payload: DirectoryMemberDeletedPayload,
  ): Promise<void> {
    const row = this.notificationRepository.create({
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
    });

    await this.notificationRepository.save(row);
  }
}