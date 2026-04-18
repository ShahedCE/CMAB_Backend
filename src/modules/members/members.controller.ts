import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Body,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberListQueryDto } from './dto/member-list-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMemberDto } from './dto/create-member.dto';

// Admin only
// @Roles('admin')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  //Manual member Creation endpoint for admins.
@Post()
@UseGuards(JwtAuthGuard)
create(
  @Body() dto: CreateMemberDto,
  @Req() req: any,
) {
  return this.membersService.createMember(dto, req.user.id);
}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: MemberListQueryDto) {
    return this.membersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)  
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}