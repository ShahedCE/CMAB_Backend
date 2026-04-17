import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminEntity } from '../../database/entities/admin.entity';
import { AdminOtpCodeEntity } from '../../database/entities/admin-otp-code.entity';
import { AdminPasswordResetLogEntity } from '../../database/entities/admin-password-reset-log.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.getOrThrow<string>('JWT_SECRET');
        const jwtExpiresIn =
          configService.get<string>('JWT_EXPIRES_IN') ?? '1d';

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiresIn as StringValue,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      AdminEntity,
      AdminOtpCodeEntity,
      AdminPasswordResetLogEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
