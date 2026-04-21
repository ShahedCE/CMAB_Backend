import {
    Controller,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('notifications')
  export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}
  
    // GET /notifications?page=1&limit=10
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
    ) {
      return this.service.findAll(Number(page), Number(limit));
    }
  
    // GET /notifications/unread-count
    @UseGuards(JwtAuthGuard)
    @Get('unread-count')
    getUnreadCount() {
      return this.service.getUnreadCount();
    }
  
    // PATCH /notifications/:id/read
    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
      return this.service.markAsRead(id);
    }
  }