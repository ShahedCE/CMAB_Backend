import { PartialType } from '@nestjs/mapped-types';
import { CreateExecutiveMemberDto } from './create-executive-member.dto';

export class UpdateExecutiveMemberDto extends PartialType(CreateExecutiveMemberDto) {}
