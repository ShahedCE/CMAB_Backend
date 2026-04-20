import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

export class EducationEntryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  degree!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  institution!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  passingYear!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  result?: string;
}

export class CreateJoinRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  fullNameBn!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  fullNameEn!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  fatherName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  motherName!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nationalId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  medicalRegNo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  membershipType!: string;

  @IsEmail()
  @MaxLength(190)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  mobile!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  presentVillage!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  presentPost!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  presentThana!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  presentDistrict!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  permanentVillage!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  permanentPost!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  permanentThana!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  permanentDistrict!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  specialty?: string | null;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? plainToInstance(EducationEntryDto, parsed)
        : parsed;
    }
    return Array.isArray(value)
      ? plainToInstance(EducationEntryDto, value)
      : value;
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EducationEntryDto)
  educationEntries!: EducationEntryDto[];

  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  workplaceTypes!: string[];

  @IsNumberString()
  entryFee!: string;

  @IsNumberString()
  annualFee!: string;

  @IsNumberString()
  lifetimeFee!: string;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  declarationAccepted!: boolean;

  @IsString()
  @IsNotEmpty()
  notes!: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string | null;
}