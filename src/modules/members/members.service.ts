import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JoinRequestEntity } from '../../database/entities/join-request.entity';
import { MemberEntity } from '../../database/entities/member.entity';
import { MemberListQueryDto } from './dto/member-list-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { DirectoryMemberAddedPayload,
   DirectoryMemberDeletedPayload,
    DirectoryMemberUpdatedPayload } from './member.events';
import { CreateMemberDto } from './dto/create-member.dto';


@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  //Implementing manual member creation
async create(
  dto: CreateMemberDto,
  adminId: string,
  profileImageUrl: string | null,
): Promise<MemberEntity> {
  const normalizedEmail = dto.email.trim().toLowerCase();

  const existing = await this.memberRepo.findOne({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new ConflictException('A member with this email already exists');
  }

  const member = this.memberRepo.create({
    fullNameBn: dto.fullNameBn.trim(),
    fullNameEn: dto.fullNameEn.trim(),
    fatherName: dto.fatherName.trim(),
    motherName: dto.motherName.trim(),
    dateOfBirth: dto.dateOfBirth,
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
    educationEntries: dto.educationEntries,
    workplaceTypes: dto.workplaceTypes,
    entryFee: dto.entryFee,
    annualFee: dto.annualFee,
    lifetimeFee: dto.lifetimeFee,
    declarationAccepted: dto.declarationAccepted,
    notes: dto.notes.trim(),
    profileImageUrl: profileImageUrl?.trim() || null,
    joinRequestId: null,
    approvedAt: new Date(),
    approvedByAdminId: adminId,
    isActive: true,
  });

  const saved = await this.memberRepo.save(member);

  this.eventEmitter.emit('directory.member.added', {
    memberId: saved.id,
    joinRequestId: saved.joinRequestId,
    fullNameEn: saved.fullNameEn,
    email: saved.email,
  } satisfies DirectoryMemberAddedPayload);

  return saved;
}


  async createFromApprovedJoinRequest(
    manager: EntityManager, // Using the transaction's EntityManager for all DB operations in this method
    joinRequest: JoinRequestEntity, //
    adminId: string | null,
  ): Promise<MemberEntity> {
    const repo = manager.getRepository(MemberEntity);

    const existing = await repo.findOne({
      where: { joinRequestId: joinRequest.id },
    });

    if (existing) {
      return existing;
    }

    const duplicateEmail = await repo.findOne({
      where: { email: joinRequest.email },
      select: ['id', 'email'],
    });

    if (duplicateEmail) {
      throw new ConflictException('Another member already exists with this email');
    }

    const row = repo.create({
      joinRequestId: joinRequest.id,
      fullNameBn: joinRequest.fullNameBn,
      fullNameEn: joinRequest.fullNameEn,
      fatherName: joinRequest.fatherName,
      motherName: joinRequest.motherName,
      dateOfBirth: joinRequest.dateOfBirth,
      nationalId: joinRequest.nationalId,
      medicalRegNo: joinRequest.medicalRegNo,
      membershipType: joinRequest.membershipType,
      email: joinRequest.email,
      mobile: joinRequest.mobile,
      phone: joinRequest.phone,
      presentVillage: joinRequest.presentVillage,
      presentPost: joinRequest.presentPost,
      presentThana: joinRequest.presentThana,
      presentDistrict: joinRequest.presentDistrict,
      permanentVillage: joinRequest.permanentVillage,
      permanentPost: joinRequest.permanentPost,
      permanentThana: joinRequest.permanentThana,
      permanentDistrict: joinRequest.permanentDistrict,
      specialty: joinRequest.specialty,
      educationEntries: joinRequest.educationEntries,
      workplaceTypes: joinRequest.workplaceTypes,
      entryFee: joinRequest.entryFee,
      annualFee: joinRequest.annualFee,
      lifetimeFee: joinRequest.lifetimeFee,
      declarationAccepted: joinRequest.declarationAccepted,
      notes: joinRequest.notes,
      profileImageUrl: joinRequest.profileImageUrl,
      approvedAt: new Date(),
      approvedByAdminId: adminId,
      isActive: true,
    });

    const saved = await repo.save(row); // Using the transaction's EntityManager to save the new member

    this.eventEmitter.emit('directory.member.added', {
      memberId: saved.id,
      joinRequestId: saved.joinRequestId || null,
      fullNameEn: saved.fullNameEn,
      email: saved.email,
    } satisfies DirectoryMemberAddedPayload);

    return saved;
  }

  async findAll(query: MemberListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.memberRepo.createQueryBuilder('m');

    if (query.search) {
      qb.andWhere(
        `
        (
          LOWER(m.fullNameEn) LIKE LOWER(:search)
          OR LOWER(m.fullNameBn) LIKE LOWER(:search)
          OR LOWER(m.email) LIKE LOWER(:search)
          OR LOWER(m.mobile) LIKE LOWER(:search)
          OR LOWER(m.medicalRegNo) LIKE LOWER(:search)
        )
        `,
        { search: `%${query.search}%` },
      );
    }

    if (query.membershipType) {
      qb.andWhere('m.membershipType = :membershipType', {
        membershipType: query.membershipType,
      });
    }

    if (query.isActive !== undefined) {
      qb.andWhere('m.isActive = :isActive', {
        isActive: query.isActive === 'true',
      });
    }

    qb.orderBy('m.createdAt', 'DESC')
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

  async findOne(id: string): Promise<MemberEntity> {
    this.ensureNumericId(id);

    const row = await this.memberRepo.findOne({
      where: { id },
      relations: ['approvedByAdmin', 'joinRequest'],
    });

    if (!row) {
      throw new NotFoundException('Member not found');
    }

    return row;
  }

  async update(id: string, dto: UpdateMemberDto): Promise<MemberEntity> {
    const member = await this.findOne(id);

    if (dto.email && dto.email.trim().toLowerCase() !== member.email) {
      const duplicate = await this.memberRepo.findOne({
        where: { email: dto.email.trim().toLowerCase() },
      });

      if (duplicate && duplicate.id !== member.id) {
        throw new ConflictException('Another member already exists with this email');
      }
    }

    Object.assign(member, {
      ...dto,
      fullNameBn: dto.fullNameBn?.trim() ?? member.fullNameBn,
      fullNameEn: dto.fullNameEn?.trim() ?? member.fullNameEn,
      fatherName: dto.fatherName?.trim() ?? member.fatherName,
      motherName: dto.motherName?.trim() ?? member.motherName,
      membershipType: dto.membershipType?.trim() ?? member.membershipType,
      email: dto.email?.trim().toLowerCase() ?? member.email,
      mobile: dto.mobile?.trim() ?? member.mobile,
      phone: dto.phone === undefined ? member.phone : dto.phone?.trim() || null,
      presentVillage: dto.presentVillage?.trim() ?? member.presentVillage,
      presentPost: dto.presentPost?.trim() ?? member.presentPost,
      presentThana: dto.presentThana?.trim() ?? member.presentThana,
      presentDistrict: dto.presentDistrict?.trim() ?? member.presentDistrict,
      permanentVillage: dto.permanentVillage?.trim() ?? member.permanentVillage,
      permanentPost: dto.permanentPost?.trim() ?? member.permanentPost,
      permanentThana: dto.permanentThana?.trim() ?? member.permanentThana,
      permanentDistrict: dto.permanentDistrict?.trim() ?? member.permanentDistrict,
      specialty:
        dto.specialty === undefined ? member.specialty : dto.specialty?.trim() || null,
      notes: dto.notes?.trim() ?? member.notes,
      profileImageUrl:
        dto.profileImageUrl === undefined
          ? member.profileImageUrl
          : dto.profileImageUrl?.trim() || null,
      isActive: dto.isActive ?? member.isActive,
    });

    const saved = await this.memberRepo.save(member);

    this.eventEmitter.emit('directory.member.updated', {
      memberId: saved.id,
      joinRequestId: saved.joinRequestId,
      fullNameEn: saved.fullNameEn,
      email: saved.email,
    } satisfies DirectoryMemberUpdatedPayload);

    return saved;
  }

  async remove(id: string) {
    const member = await this.findOne(id);

    await this.memberRepo.remove(member);

    this.eventEmitter.emit('directory.member.deleted', {
      memberId: member.id,
      joinRequestId: member.joinRequestId,
      fullNameEn: member.fullNameEn,
      email: member.email,
    } satisfies DirectoryMemberDeletedPayload);

    return {
      success: true,
      message: 'Member deleted successfully',
    };
  }

  private ensureNumericId(id: string): void {
    if (!/^\d+$/.test(id)) {
      throw new BadRequestException('Invalid id format');
    }
  }
}