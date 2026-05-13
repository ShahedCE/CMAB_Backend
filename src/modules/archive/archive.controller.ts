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
  const parsedDto: any = { ...dto };

  if (dto.imagesJson && typeof dto.imagesJson === 'string') {
    try {
      parsedDto.imagesJson = JSON.parse(dto.imagesJson);
    } catch {
      throw new BadRequestException('Invalid imagesJson format');
    }
  }

  if (dto.membersJson && typeof dto.membersJson === 'string') {
    try {
      parsedDto.membersJson = JSON.parse(dto.membersJson);
    } catch {
      throw new BadRequestException('Invalid membersJson format');
    }
  }

  const coverImageFile = files?.find((file) => file.fieldname === 'coverImage');
  const souvenirFile = files?.find((file) => file.fieldname === 'file');
  const imageFiles = files?.filter((file) => file.fieldname === 'images') ?? [];

  const memberPhotoFiles =
    files?.filter((file) => file.fieldname.startsWith('memberPhoto_')) ?? [];

  if (Array.isArray(parsedDto.membersJson)) {
    parsedDto.membersJson = parsedDto.membersJson.map(
      (member: any, index: number) => {
        const photoFile = memberPhotoFiles.find(
          (file) => file.fieldname === `memberPhoto_${index}`,
        );

        return {
          ...member,
          photoUrl: photoFile
            ? `/uploads/archive/${photoFile.filename}`
            : member.photoUrl,
        };
      },
    );
  }

  const coverImageUrl = coverImageFile
    ? `/uploads/archive/${coverImageFile.filename}`
    : undefined;

  const fileUrl = souvenirFile
    ? `/uploads/archive/${souvenirFile.filename}`
    : undefined;

  const additionalImageUrls = imageFiles.map(
    (file) => `/uploads/archive/${file.filename}`,
  );

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
  const parsedDto: any = { ...dto };

  if (dto.imagesJson && typeof dto.imagesJson === 'string') {
    try {
      parsedDto.imagesJson = JSON.parse(dto.imagesJson);
    } catch {
      throw new BadRequestException('Invalid imagesJson format');
    }
  }

  if (dto.membersJson && typeof dto.membersJson === 'string') {
    try {
      parsedDto.membersJson = JSON.parse(dto.membersJson);
    } catch {
      throw new BadRequestException('Invalid membersJson format');
    }
  }

  const coverImageFile = files?.find((file) => file.fieldname === 'coverImage');
  const souvenirFile = files?.find((file) => file.fieldname === 'file');
  const imageFiles = files?.filter((file) => file.fieldname === 'images') ?? [];

  const memberPhotoFiles =
    files?.filter((file) => file.fieldname.startsWith('memberPhoto_')) ?? [];

  if (Array.isArray(parsedDto.membersJson)) {
    parsedDto.membersJson = parsedDto.membersJson.map(
      (member: any, index: number) => {
        const photoFile = memberPhotoFiles.find(
          (file) => file.fieldname === `memberPhoto_${index}`,
        );

        return {
          ...member,
          photoUrl: photoFile
            ? `/uploads/archive/${photoFile.filename}`
            : member.photoUrl,
        };
      },
    );
  }

  const coverImageUrl = coverImageFile
    ? `/uploads/archive/${coverImageFile.filename}`
    : undefined;

  const fileUrl = souvenirFile
    ? `/uploads/archive/${souvenirFile.filename}`
    : undefined;

  const additionalImageUrls = imageFiles.map(
    (file) => `/uploads/archive/${file.filename}`,
  );

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
