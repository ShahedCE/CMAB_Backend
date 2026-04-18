import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinRequestEntity } from '../../database/entities/join-request.entity';
import { MembersModule } from '../members/members.module';
import { JoinRequestsController } from './join-request.controller';
import { JoinRequestsService } from './join-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JoinRequestEntity]),
    MembersModule,
  ],
  controllers: [JoinRequestsController],
  providers: [JoinRequestsService],
  exports: [JoinRequestsService],
})
export class JoinRequestsModule {}