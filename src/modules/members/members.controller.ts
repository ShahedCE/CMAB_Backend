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
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberListQueryDto } from './dto/member-list-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { multerConfig } from 'src/uploads/multer.config';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

// Admin only
// @Roles('admin')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  //Manual member Creation endpoint for admins.
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', multerConfig('members')),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMemberDto,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Profile image is required');
    }

    const profileImageUrl = `/uploads/members/${file.filename}`;

    return this.membersService.create(
      dto,
      req.user.id,
      profileImageUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: MemberListQueryDto) {
    return this.membersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  //Update
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('profileImage', multerConfig('members')),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateMemberDto,
  ) {
    if (file) {
      dto.profileImageUrl = `/uploads/members/${file.filename}`;
    }
  
    return this.membersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}