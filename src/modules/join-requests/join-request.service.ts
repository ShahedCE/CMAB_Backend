import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JoinRequestEntity } from '../../database/entities/join-request.entity';
import { MemberEntity } from '../../database/entities/member.entity';
import { MembersService } from '../members/members.service';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { JoinRequestListQueryDto } from './dto/join-request-list-query.dto';
import { RejectJoinRequestDto } from './dto/reject-join-request.dto';
import type {
  JoinRequestApprovedPayload,
  JoinRequestCreatedPayload,
  JoinRequestRejectedPayload,
} from './join-request.events';

@Injectable()
export class JoinRequestsService {
  constructor(
    @InjectRepository(JoinRequestEntity)
    private readonly joinRequestRepo: Repository<JoinRequestEntity>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly membersService: MembersService,
  ) {}

  
async create(
  dto: CreateJoinRequestDto,
  profileImageUrl: string | null,
  adminId: string | null,
): Promise<JoinRequestEntity> {
  const normalizedEmail = dto.email.trim().toLowerCase();

  const existingApprovedMember = await this.dataSource
    .getRepository(MemberEntity)
    .findOne({
      where: { email: normalizedEmail },
      select: ['id', 'email'],
    });

  if (existingApprovedMember) {
    throw new ConflictException('A member already exists with this email');
  }

  const row = this.joinRequestRepo.create({
    ...dto,
    fullNameBn: dto.fullNameBn.trim(),
    fullNameEn: dto.fullNameEn.trim(),
    fatherName: dto.fatherName.trim(),
    motherName: dto.motherName.trim(),
    nationalId: dto.nationalId.trim(),
    medicalRegNo: dto.medicalRegNo.trim(),
    membershipType: dto.membershipType.trim(),
    email: normalizedEmail,
    mobile: dto.mobile.trim(),
    phone: dto.phone?.trim() || null,
    presentVillage: dto.presentVillage.trim(),
    presentPost: dto.presentPost.trim(),
    presentThana: dto.presentThana.trim(),
    presentDistrict: dto.presentDistrict.trim(),
    permanentVillage: dto.permanentVillage.trim(),
    permanentPost: dto.permanentPost.trim(),
    permanentThana: dto.permanentThana.trim(),
    permanentDistrict: dto.permanentDistrict.trim(),
    specialty: dto.specialty?.trim() || null,
    notes: dto.notes.trim(),

    profileImageUrl: profileImageUrl?.trim() || null,

    status: 'pending',
    reviewedAt: null,
    reviewedByAdminId: adminId ?? null,
    rejectionReason: null,
  });

  const saved = await this.joinRequestRepo.save(row);

  this.eventEmitter.emit('join_request.created', {
    joinRequestId: saved.id,
    fullNameEn: saved.fullNameEn,
    email: saved.email,
    createdAt: saved.createdAt,
  } satisfies JoinRequestCreatedPayload);

  return saved;
}

  async findAll(query: JoinRequestListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.joinRequestRepo.createQueryBuilder('jr');

    if (query.status) {
      qb.andWhere('jr.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        `
        (
          LOWER(jr.fullNameEn) LIKE LOWER(:search)
          OR LOWER(jr.fullNameBn) LIKE LOWER(:search)
          OR LOWER(jr.email) LIKE LOWER(:search)
          OR LOWER(jr.mobile) LIKE LOWER(:search)
          OR LOWER(jr.medicalRegNo) LIKE LOWER(:search)
        )
        `,
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('jr.createdAt', 'DESC')
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

  async findOne(id: string): Promise<JoinRequestEntity> {
    this.ensureNumericId(id);

    const row = await this.joinRequestRepo.findOne({
      where: { id },
      relations: ['reviewedByAdmin'],
    });

    if (!row) {
      throw new NotFoundException('Join request not found');
    }

    return row;
  }

  async approve(id: string, adminId: string) {
    this.ensureNumericId(id);
    this.ensureNumericId(adminId);

    const result = await this.dataSource.transaction(async (manager) => {
      const joinRequestRepo = manager.getRepository(JoinRequestEntity);

      const row = await joinRequestRepo
        .createQueryBuilder('jr')
        .setLock('pessimistic_write')
        .where('jr.id = :id', { id })
        .getOne();

      if (!row) {
        throw new NotFoundException('Join request not found');
      }

      if (row.status !== 'pending') {
        throw new BadRequestException(
          `Only pending requests can be approved. Current status: ${row.status}`,
        );
      }

      row.status = 'approved';
      row.reviewedByAdminId = adminId;
      row.reviewedAt = new Date();
      row.rejectionReason = null;

      await joinRequestRepo.save(row);

      const member = await this.membersService.createFromApprovedJoinRequest(
        manager,
        row,
        adminId,
      );

      return { row, member };
    });

    this.eventEmitter.emit('join_request.approved', {
      joinRequestId: result.row.id,
      memberId: result.member.id,
      fullNameEn: result.row.fullNameEn,
      email: result.row.email,
      approvedAt: result.member.approvedAt,
      approvedByAdminId: result.member.approvedByAdminId,
    } satisfies JoinRequestApprovedPayload);

    return result;
  }
 //find pending join requests
 async findPendingJoinRequests() {
  return this.joinRequestRepo.find({
    where: { status: 'pending' },
  });
 }
 
  async reject(id: string, adminId: string, dto: RejectJoinRequestDto) {
    this.ensureNumericId(id);
    this.ensureNumericId(adminId);

    const row = await this.findOne(id);

    if (row.status !== 'pending') {
      throw new BadRequestException(
        `Only pending requests can be rejected. Current status: ${row.status}`,
      );
    }

    row.status = 'rejected';
    row.reviewedByAdminId = adminId;
    row.reviewedAt = new Date();
    row.rejectionReason = dto.reason?.trim() || null;

    const saved = await this.joinRequestRepo.save(row);

    this.eventEmitter.emit('join_request.rejected', {
      joinRequestId: saved.id,
      fullNameEn: saved.fullNameEn,
      email: saved.email,
      rejectedAt: new Date(),
      reason: saved.rejectionReason,
    } satisfies JoinRequestRejectedPayload);

    return saved;
  }

  private ensureNumericId(id: string): void {
    if (!/^\d+$/.test(id)) {
      throw new BadRequestException('Invalid id format');
    }
  }
}