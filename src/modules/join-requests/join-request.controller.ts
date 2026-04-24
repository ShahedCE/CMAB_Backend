import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestsService } from './join-request.service';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { JoinRequestListQueryDto } from './dto/join-request-list-query.dto';
import { RejectJoinRequestDto } from './dto/reject-join-request.dto';
import { multerConfig } from 'src/uploads/multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import * as authRequest from 'src/types/auth-request';

// Replace these with your actual auth guards/decorators
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('join-requests')
export class JoinRequestsController {
  constructor(private readonly service: JoinRequestsService) {}

@Post()
@UseInterceptors(
  FileInterceptor('profileImage', multerConfig('join-requests')),
)
create(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateJoinRequestDto,
  @Req() req:   authRequest.AuthRequest,
) {
  const profileImageUrl = file
    ? `/uploads/join-requests/${file.filename}`
    : null;

  const adminId = req.user?.id ?? null;

  return this.service.create(dto, profileImageUrl, adminId);
}
  // Admin only
   @UseGuards(JwtAuthGuard)
  
  @Get()
  findAll(@Query() query: JoinRequestListQueryDto) {
    return this.service.findAll(query);
  }

  // Admin only
   @UseGuards(JwtAuthGuard)

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Admin only
 
   @UseGuards(JwtAuthGuard)
@Patch(':id/approve')
approve(@Param('id') id: string, @Req() req: any) {
  console.log('joinRequestId:', id);
  console.log('admin user:', req.user);
  return this.service.approve(id, req.user.sub);
}

  // Admin only
   @UseGuards(JwtAuthGuard)

  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: RejectJoinRequestDto,
    @Req() req: any,
  ) {
    return this.service.reject(id, req.user.sub, dto);
  }

  
}