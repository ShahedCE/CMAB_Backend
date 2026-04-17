import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactMessageEntity } from '../../database/entities/contact-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactMessageEntity]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
