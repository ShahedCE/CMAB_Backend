import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ExecutiveMemberQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  designation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(190)
  email?: string;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page?: number;

  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  limit?: number;
}
