import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutiveMemberEntity } from '../../database/entities/executive-member.entity';
import { ExecutiveMembersController } from './executive-members.controller';
import { ExecutiveMembersService } from './executive-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExecutiveMemberEntity])],
  controllers: [ExecutiveMembersController],
  providers: [ExecutiveMembersService],
  exports: [ExecutiveMembersService],
})
export class ExecutiveMembersModule {}
