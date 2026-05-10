import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { ArchiveCategory } from '../../../database/entities/archive.entity';

export class MemberDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  designation!: string;

 @IsOptional()
@IsString()
photoUrl?: string;
}

export class ImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class CreateArchiveDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title!: string;

  @IsEnum(ArchiveCategory)
  category!: ArchiveCategory;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  division?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  year?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsUrl()
  fileUrl?: string;

 @Transform(({ value }) => {
  if (value === undefined || value === null || value === '') return undefined;

  const parsed = typeof value === 'string' ? JSON.parse(value) : value;

  return Array.isArray(parsed)
    ? plainToInstance(ImageDto, parsed)
    : parsed;
})
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => ImageDto)
imagesJson?: ImageDto[];

@Transform(({ value }) => {
  if (value === undefined || value === null || value === '') return undefined;

  const parsed = typeof value === 'string' ? JSON.parse(value) : value;

  return Array.isArray(parsed)
    ? plainToInstance(MemberDto, parsed)
    : parsed;
})
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => MemberDto)
membersJson?: MemberDto[];

  @Transform(({ value }) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
})
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = true;
}
