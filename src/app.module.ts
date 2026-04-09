import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { MembersModule } from './modules/members/members.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    AuthModule, ContactModule, ActivitiesModule, 
    MembersModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
