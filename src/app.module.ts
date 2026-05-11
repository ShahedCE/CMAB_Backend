import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { MembersModule } from './modules/members/members.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { envValidationSchema } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './database/entities/admin.entity';
import { JoinRequestEntity } from './database/entities/join-request.entity';
import { ContactMessageEntity } from './database/entities/contact-message.entity';
import { NotificationEntity } from './database/entities/notification.entity';
import { AdminOtpCodeEntity } from './database/entities/admin-otp-code.entity';
import { AdminPasswordResetLogEntity } from './database/entities/admin-password-reset-log.entity';
import { MemberEntity } from './database/entities/member.entity';
import { JoinRequestsModule } from './modules/join-requests/join-request.module';
import { ActivityEntity } from './database/entities/activity.entity';
import { ArchiveModule } from './modules/archive/archive.module';
import { ArchiveEntity } from './database/entities/archive.entity';
import { MessagesModule } from './modules/messages/messages.module';
import { MessageEntity } from './database/entities/message.entity';
import { ExecutiveMembersModule } from './modules/executive-members/executive-members.module';
import { ExecutiveMemberEntity } from './database/entities/executive-member.entity';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule, ContactModule, ActivitiesModule, 
    MembersModule, NotificationsModule,
    JoinRequestsModule,ActivitiesModule, ArchiveModule, MessagesModule, ExecutiveMembersModule,

    
    //.env files are globally available throughout the application.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        // Here, the environment condition is being checked.
        // If it is a production environment (NODE_ENV === 'production'),
        // then it will use the '.env.production' file..
        // Otherwise, it will use the '.env.development' file.
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      validationSchema: envValidationSchema,
    }),

    //DB connection
    TypeOrmModule.forRootAsync({
      
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [ //register entities
          AdminEntity,
          JoinRequestEntity,
          ContactMessageEntity,
          NotificationEntity,
          AdminOtpCodeEntity,
          AdminPasswordResetLogEntity,
          MemberEntity,
          ActivityEntity,
          ArchiveEntity,
          MessageEntity,
          ExecutiveMemberEntity
        ],
        autoLoadEntities: false, //automatic load entities
        synchronize: configService.get<string>('NODE_ENV') === 'development' ? true : false, //auto sync entities with db (disable in production)
        logging: configService.get<boolean>('DB_LOGGING'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
