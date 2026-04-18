import { Transform, Type } from 'class-transformer';
import {
  IsBooleanString,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class MemberListQueryDto {
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
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString()
  membershipType?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}