import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
  
  @IsOptional()
  @IsUrl()
  image?: string | null;
}