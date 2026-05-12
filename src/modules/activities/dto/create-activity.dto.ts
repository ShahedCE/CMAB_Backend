import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  fullDescription!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsString({ each: true })
  images?: string[] | null;

}