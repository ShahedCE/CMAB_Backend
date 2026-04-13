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
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule, ContactModule, ActivitiesModule, 
    MembersModule, NotificationsModule,

    
    //.env files are globally available throughout the application.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        // Here, the environment condition is being checked.
        // If it is a production environment (NODE_ENV === 'production'),
        // then it will use the '.env.production' file.
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
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get<boolean>('DB_LOGGING'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
