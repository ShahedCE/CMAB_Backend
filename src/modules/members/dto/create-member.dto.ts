import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMemberDto {
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

  /** YYYY-MM-DD */
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
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

  @IsArray()
  @ArrayMinSize(0)
  educationEntries!: unknown[];

  @IsArray()
  @ArrayMinSize(0)
  workplaceTypes!: unknown[];

  @IsNumber()
  @Min(0)
  entryFee!: number;

  @IsNumber()
  @Min(0)
  annualFee!: number;

  @IsNumber()
  @Min(0)
  lifetimeFee!: number;

  @IsBoolean()
  declarationAccepted!: boolean;

  @IsString()
  @MinLength(1)
  notes!: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string | null;

  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';
}
