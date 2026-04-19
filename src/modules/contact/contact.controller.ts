import { Body, Controller, HttpCode, HttpStatus, Post,Get, UseGuards, Query, Param, Patch } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactListQueryDto } from './dto/contact-list-quiry.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateContactDto) {
    return this.contactService.create(body);
  }

  //Admin Routes
   @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: ContactListQueryDto) {
    return this.contactService.findAll(query);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }
    @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }
}
