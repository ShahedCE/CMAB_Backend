import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinRequestEntity } from '../../database/entities/join-request.entity';
import { MemberEntity } from '../../database/entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

export type JoinRequestCreatedPayload = {
  id: string;
  fullNameEn: string;
  email: string;
  createdAt: Date;
};

export type JoinRequestUpdatedPayload = {
  id: string;
  fullNameEn: string;
  email: string;
};

export type JoinRequestDeletedPayload = {
  id: string;
  fullNameEn: string;
  email: string;
};

export type DirectoryMemberAddedPayload = {
  memberId: string;
  joinRequestId: string;
  fullNameEn: string;
  email: string;
};

export type DirectoryMemberUpdatedPayload = {
  memberId: string;
  joinRequestId: string;
  fullNameEn: string;
  email: string;
};

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(JoinRequestEntity)
    private readonly joinRequestRepository: Repository<JoinRequestEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<JoinRequestEntity[]> {
    return this.joinRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<JoinRequestEntity> {
    const row = await this.joinRequestRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Member not found');
    }
    return row;
  }

  async create(dto: CreateMemberDto): Promise<JoinRequestEntity> {
    const row = this.joinRequestRepository.create({
      fullNameBn: dto.fullNameBn.trim(),
      fullNameEn: dto.fullNameEn.trim(),
      fatherName: dto.fatherName.trim(),
      motherName: dto.motherName.trim(),
      dateOfBirth: dto.dateOfBirth,
      nationalId: dto.nationalId.trim(),
      medicalRegNo: dto.medicalRegNo.trim(),
      membershipType: dto.membershipType.trim(),
      email: dto.email.trim().toLowerCase(),
      mobile: dto.mobile.trim(),
      phone: dto.phone?.trim() ?? null,
      presentVillage: dto.presentVillage.trim(),
      presentPost: dto.presentPost.trim(),
      presentThana: dto.presentThana.trim(),
      presentDistrict: dto.presentDistrict.trim(),
      permanentVillage: dto.permanentVillage.trim(),
      permanentPost: dto.permanentPost.trim(),
      permanentThana: dto.permanentThana.trim(),
      permanentDistrict: dto.permanentDistrict.trim(),
      specialty: dto.specialty?.trim() ?? null,
      educationEntries: dto.educationEntries,
      workplaceTypes: dto.workplaceTypes,
      entryFee: String(dto.entryFee),
      annualFee: String(dto.annualFee),
      lifetimeFee: String(dto.lifetimeFee),
      declarationAccepted: dto.declarationAccepted,
      notes: dto.notes.trim(),
      profileImageUrl: dto.profileImageUrl?.trim() ?? null,
      status: dto.status ?? 'pending',
      reviewedByAdminId: null,
      reviewedAt: null,
      rejectionReason: null,
    });

    await this.joinRequestRepository.save(row);

    this.eventEmitter.emit('join_request.created', {
      id: row.id,
      fullNameEn: row.fullNameEn,
      email: row.email,
      createdAt: row.createdAt,
    } satisfies JoinRequestCreatedPayload);

    await this.syncDirectoryMemberFromJoinRequest(row);

    return row;
  }

  async update(id: string, dto: UpdateMemberDto): Promise<JoinRequestEntity> {
    const row = await this.joinRequestRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Member not found');
    }

    if (dto.fullNameBn !== undefined) row.fullNameBn = dto.fullNameBn.trim();
    if (dto.fullNameEn !== undefined) row.fullNameEn = dto.fullNameEn.trim();
    if (dto.fatherName !== undefined) row.fatherName = dto.fatherName.trim();
    if (dto.motherName !== undefined) row.motherName = dto.motherName.trim();
    if (dto.dateOfBirth !== undefined) row.dateOfBirth = dto.dateOfBirth;
    if (dto.nationalId !== undefined) row.nationalId = dto.nationalId.trim();
    if (dto.medicalRegNo !== undefined) {
      row.medicalRegNo = dto.medicalRegNo.trim();
    }
    if (dto.membershipType !== undefined) {
      row.membershipType = dto.membershipType.trim();
    }
    if (dto.email !== undefined) row.email = dto.email.trim().toLowerCase();
    if (dto.mobile !== undefined) row.mobile = dto.mobile.trim();
    if (dto.phone !== undefined) row.phone = dto.phone?.trim() ?? null;
    if (dto.presentVillage !== undefined) {
      row.presentVillage = dto.presentVillage.trim();
    }
    if (dto.presentPost !== undefined) row.presentPost = dto.presentPost.trim();
    if (dto.presentThana !== undefined) {
      row.presentThana = dto.presentThana.trim();
    }
    if (dto.presentDistrict !== undefined) {
      row.presentDistrict = dto.presentDistrict.trim();
    }
    if (dto.permanentVillage !== undefined) {
      row.permanentVillage = dto.permanentVillage.trim();
    }
    if (dto.permanentPost !== undefined) {
      row.permanentPost = dto.permanentPost.trim();
    }
    if (dto.permanentThana !== undefined) {
      row.permanentThana = dto.permanentThana.trim();
    }
    if (dto.permanentDistrict !== undefined) {
      row.permanentDistrict = dto.permanentDistrict.trim();
    }
    if (dto.specialty !== undefined) {
      row.specialty = dto.specialty?.trim() ?? null;
    }
    if (dto.educationEntries !== undefined) {
      row.educationEntries = dto.educationEntries;
    }
    if (dto.workplaceTypes !== undefined) {
      row.workplaceTypes = dto.workplaceTypes;
    }
    if (dto.entryFee !== undefined) row.entryFee = String(dto.entryFee);
    if (dto.annualFee !== undefined) row.annualFee = String(dto.annualFee);
    if (dto.lifetimeFee !== undefined) {
      row.lifetimeFee = String(dto.lifetimeFee);
    }
    if (dto.declarationAccepted !== undefined) {
      row.declarationAccepted = dto.declarationAccepted;
    }
    if (dto.notes !== undefined) row.notes = dto.notes.trim();
    if (dto.profileImageUrl !== undefined) {
      row.profileImageUrl = dto.profileImageUrl?.trim() ?? null;
    }
    if (dto.status !== undefined) row.status = dto.status;

    await this.joinRequestRepository.save(row);

    this.eventEmitter.emit('join_request.updated', {
      id: row.id,
      fullNameEn: row.fullNameEn,
      email: row.email,
    } satisfies JoinRequestUpdatedPayload);

    await this.syncDirectoryMemberFromJoinRequest(row);

    return row;
  }

  async remove(id: string): Promise<void> {
    const row = await this.joinRequestRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Member not found');
    }

    const payload: JoinRequestDeletedPayload = {
      id: row.id,
      fullNameEn: row.fullNameEn,
      email: row.email,
    };

    await this.joinRequestRepository.remove(row);
    this.eventEmitter.emit('join_request.deleted', payload);
  }

  /**
   * When `join_requests.status` is `approved`, upsert full snapshot into `members`.
   * Otherwise mark directory row inactive (keeps history).
   */
  private async syncDirectoryMemberFromJoinRequest(
    join: JoinRequestEntity,
  ): Promise<void> {
    if (join.status !== 'approved') {
      const existing = await this.memberRepository.findOne({
        where: { joinRequestId: join.id },
      });
      if (existing?.isActive) {
        existing.isActive = false;
        await this.memberRepository.save(existing);
      }
      return;
    }

    const snapshot = this.snapshotFromJoinRequest(join);
    const approvedAt = join.reviewedAt ?? new Date();
    const approvedByAdminId = join.reviewedByAdminId;

    let member = await this.memberRepository.findOne({
      where: { joinRequestId: join.id },
    });

    if (!member) {
      member = this.memberRepository.create({
        joinRequestId: join.id,
        ...snapshot,
        approvedAt,
        approvedByAdminId,
        isActive: true,
      });
      await this.memberRepository.save(member);
      this.eventEmitter.emit('directory.member.added', {
        memberId: member.id,
        joinRequestId: join.id,
        fullNameEn: member.fullNameEn,
        email: member.email,
      } satisfies DirectoryMemberAddedPayload);
      return;
    }

    Object.assign(member, snapshot);
    member.approvedAt = approvedAt;
    member.approvedByAdminId = approvedByAdminId;
    member.isActive = true;
    await this.memberRepository.save(member);

    this.eventEmitter.emit('directory.member.updated', {
      memberId: member.id,
      joinRequestId: join.id,
      fullNameEn: member.fullNameEn,
      email: member.email,
    } satisfies DirectoryMemberUpdatedPayload);
  }

  private snapshotFromJoinRequest(join: JoinRequestEntity) {
    return {
      fullNameBn: join.fullNameBn,
      fullNameEn: join.fullNameEn,
      fatherName: join.fatherName,
      motherName: join.motherName,
      dateOfBirth: join.dateOfBirth,
      nationalId: join.nationalId,
      medicalRegNo: join.medicalRegNo,
      membershipType: join.membershipType,
      email: join.email,
      mobile: join.mobile,
      phone: join.phone,
      presentVillage: join.presentVillage,
      presentPost: join.presentPost,
      presentThana: join.presentThana,
      presentDistrict: join.presentDistrict,
      permanentVillage: join.permanentVillage,
      permanentPost: join.permanentPost,
      permanentThana: join.permanentThana,
      permanentDistrict: join.permanentDistrict,
      specialty: join.specialty,
      educationEntries: join.educationEntries,
      workplaceTypes: join.workplaceTypes,
      entryFee: join.entryFee,
      annualFee: join.annualFee,
      lifetimeFee: join.lifetimeFee,
      declarationAccepted: join.declarationAccepted,
      notes: join.notes,
      profileImageUrl: join.profileImageUrl,
    };
  }
}
