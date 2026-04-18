import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JoinRequestsService } from './join-request.service';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { JoinRequestListQueryDto } from './dto/join-request-list-query.dto';
import { RejectJoinRequestDto } from './dto/reject-join-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Replace these with your actual auth guards/decorators
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('join-requests')
export class JoinRequestsController {
  constructor(private readonly service: JoinRequestsService) {}

  // Public endpoint
  @Post()
  create(@Body() dto: CreateJoinRequestDto) {
    return this.service.create(dto);
  }

  // Admin only
   @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  @Get()
  findAll(@Query() query: JoinRequestListQueryDto) {
    return this.service.findAll(query);
  }

  // Admin only
   @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Admin only
   // @Roles('admin')
   @UseGuards(JwtAuthGuard)
@Patch(':id/approve')
approve(@Param('id') id: string, @Req() req: any) {
  console.log('joinRequestId:', id);
  console.log('admin user:', req.user);
  return this.service.approve(id, req.user.sub);
}

  // Admin only
   @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: RejectJoinRequestDto,
    @Req() req: any,
  ) {
    return this.service.reject(id, req.user.sub, dto);
  }
}