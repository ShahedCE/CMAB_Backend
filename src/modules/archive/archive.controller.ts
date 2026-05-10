import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseArrayPipe,
  BadRequestException,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Express } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateArchiveDto } from './dto/update-archive.dto';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { multerConfig } from 'src/uploads/multer.config';
import { AnyFilesInterceptor } from '@nestjs/platform-express/multer';
import { ArchiveQueryDto } from './dto/archive-query.dto';
import { ArchiveService } from './archive.service';

@Controller('archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  async findAll(@Query() query: ArchiveQueryDto) {
    return this.archiveService.findAll(query);
  }

 @Get(':id')
findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.archiveService.findOne(id);
}

  // Admin Routes - Only Admin can create, update and delete archives

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(multerConfig('archive')))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateArchiveDto,
    @Req() req: any,
  ) {
    const adminId = req.user.sub;

    // Parse JSON fields from form data
    let parsedDto = { ...dto };
    
    // Handle imagesJson from form data
    if (dto.imagesJson && typeof dto.imagesJson === 'string') {
      try {
        parsedDto.imagesJson = JSON.parse(dto.imagesJson);
      } catch (error) {
        throw new BadRequestException('Invalid imagesJson format');
      }
    }

    // Handle membersJson from form data
    if (dto.membersJson && typeof dto.membersJson === 'string') {
      try {
        parsedDto.membersJson = JSON.parse(dto.membersJson);
      } catch (error) {
        throw new BadRequestException('Invalid membersJson format');
      }
    }

    // Extract files from the uploaded files array
    const coverImageFile = files?.find(file => file.fieldname === 'coverImage');
    const file = files?.find(file => file.fieldname === 'file');
    const imageFiles = files?.filter(file => file.fieldname === 'images');

    const coverImageUrl = coverImageFile
      ? `/uploads/archive/${coverImageFile.filename}`
      : undefined;

    const fileUrl = file
      ? `/uploads/archive/${file.filename}`
      : undefined;

    const additionalImageUrls = imageFiles
      ? imageFiles.map((file) => `/uploads/archive/${file.filename}`)
      : [];

    return this.archiveService.create(
      parsedDto,
      adminId,
      coverImageUrl,
      fileUrl,
      additionalImageUrls,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(multerConfig('archive')))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateArchiveDto,
    @Req() req: any,
  ) {
    const adminId = String(req.user.sub);

    // Parse JSON fields from form data
    let parsedDto = { ...dto };
    
    // Handle imagesJson from form data
    if (dto.imagesJson && typeof dto.imagesJson === 'string') {
      try {
        parsedDto.imagesJson = JSON.parse(dto.imagesJson);
      } catch (error) {
        throw new BadRequestException('Invalid imagesJson format');
      }
    }

    // Handle membersJson from form data
    if (dto.membersJson && typeof dto.membersJson === 'string') {
      try {
        parsedDto.membersJson = JSON.parse(dto.membersJson);
      } catch (error) {
        throw new BadRequestException('Invalid membersJson format');
      }
    }

    // Extract files from the uploaded files array
    const coverImageFile = files?.find(file => file.fieldname === 'coverImage');
    const file = files?.find(file => file.fieldname === 'file');
    const imageFiles = files?.filter(file => file.fieldname === 'images');

    const coverImageUrl = coverImageFile
      ? `/uploads/archive/${coverImageFile.filename}`
      : undefined;

    const fileUrl = file
      ? `/uploads/archive/${file.filename}`
      : undefined;

    const additionalImageUrls = imageFiles
      ? imageFiles.map((file) => `/uploads/archive/${file.filename}`)
      : [];

    return this.archiveService.update(
      id,
      parsedDto,
      adminId,
      coverImageUrl,
      fileUrl,
      additionalImageUrls,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.archiveService.remove(id);
  }
}
