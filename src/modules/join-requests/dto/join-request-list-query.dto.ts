import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class JoinRequestListQueryDto {
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
  @IsIn(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}