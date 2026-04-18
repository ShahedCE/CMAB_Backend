import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectJoinRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}