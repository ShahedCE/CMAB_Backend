import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinRequestEntity } from '../../database/entities/join-request.entity';
import { MemberEntity } from '../../database/entities/member.entity';
import { AuthModule } from '../auth/auth.module';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JoinRequestEntity, MemberEntity]),
    AuthModule,
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
