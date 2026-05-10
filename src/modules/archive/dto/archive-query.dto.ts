import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { ArchiveCategory } from '../../../database/entities/archive.entity';

export class ArchiveQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ArchiveCategory)
  category?: ArchiveCategory;

  @IsOptional()
  @IsString()
  division?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}
