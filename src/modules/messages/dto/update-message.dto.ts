import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  organizationName?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  fatherName?: string;

  @IsString()
  @MinLength(5)
  message?: string;
}
