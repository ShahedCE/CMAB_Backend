import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EducationEntryDto } from '../../join-requests/dto/create-join-request.dto';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  fullNameBn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  fullNameEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  fatherName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  motherName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  membershipType?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(190)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  mobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  presentVillage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  presentPost?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  presentThana?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  presentDistrict?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  permanentVillage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  permanentPost?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  permanentThana?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  permanentDistrict?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  specialty?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntryDto)
  educationEntries?: EducationEntryDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workplaceTypes?: string[];

  @IsOptional()
  @IsNumberString()
  entryFee?: string;

  @IsOptional()
  @IsNumberString()
  annualFee?: string;

  @IsOptional()
  @IsNumberString()
  lifetimeFee?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}