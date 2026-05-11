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
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutiveMembersService } from './executive-members.service';
import { ExecutiveMemberQueryDto } from './dto/executive-member-query.dto';
import { CreateExecutiveMemberDto } from './dto/create-executive-member.dto';
import { UpdateExecutiveMemberDto } from './dto/update-executive-member.dto';

@Controller('executive-members')
export class ExecutiveMembersController {
  constructor(private readonly executiveMembersService: ExecutiveMembersService) {}

  @Get()
  async findAll(@Query() query: ExecutiveMemberQueryDto) {
    return this.executiveMembersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.executiveMembersService.findOne(id);
  }

  // Admin only
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/executive-members',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateExecutiveMemberDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^(image\/jpe?g|image\/png|image\/gif)$/i }),
      ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/executive-members/${file.filename}`;
    }
    return this.executiveMembersService.create(dto);
  }

  // Admin only
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/executive-members',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExecutiveMemberDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/executive-members/${file.filename}`;
    }
    return this.executiveMembersService.update(id, dto);
  }

  // Admin only
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.executiveMembersService.remove(id);
  }
}
