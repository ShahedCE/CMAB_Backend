import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import type { Express } from 'express';  // Use 'import type' for decorator metadata compliance
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { multerConfig } from 'src/uploads/multer.config';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { ActivityListQueryDto } from './dto/activity-list-query.dto';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async findAll(@Query() query: ActivityListQueryDto) {
    return this.activitiesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  //Admin Routes
  //Only Admin can create, update and delete activities

  //Create Activity
 @Post()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('image', multerConfig('activities')))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateActivityDto,
  @Req() req: any,
) {
  const adminId = req.user.sub;

  const imageUrl = `/uploads/activities/${file.filename}`;

  return this.activitiesService.create(dto, adminId, imageUrl);
}

 @Patch(':id')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('image', multerConfig('activities')))
async update(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: UpdateActivityDto,
  @Req() req: any,
) {
  const adminId = String(req.user.sub);

  const imageUrl = file
    ? `/uploads/activities/${file.filename}`
    : undefined;

  return this.activitiesService.update(id, dto, adminId, imageUrl);
}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
 async remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}