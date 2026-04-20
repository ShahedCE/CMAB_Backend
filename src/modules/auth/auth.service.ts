import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { AdminEntity } from '../../database/entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AdminOtpCodeEntity } from '../../database/entities/admin-otp-code.entity';
import { AdminPasswordResetLogEntity } from '../../database/entities/admin-password-reset-log.entity';

type RequestMeta = {
  ip: string | null;
  userAgent: string | null | string[];
};

@Injectable()
export class AuthService {
  private static readonly OTP_LENGTH = 6;
  private static readonly OTP_MAX_ATTEMPTS = 3;

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(AdminOtpCodeEntity)
    private readonly otpRepository: Repository<AdminOtpCodeEntity>,
    @InjectRepository(AdminPasswordResetLogEntity)
    private readonly resetLogRepository: Repository<AdminPasswordResetLogEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(body: LoginDto) {
    const admin = await this.adminRepository.findOne({ //Finding Existing Admin if exists
      where: { email: body.email },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(body.password, admin.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    admin.lastLoginAt = new Date();
    await this.adminRepository.save(admin);

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  //Forgot Password
  async forgotPassword(body: ForgotPasswordDto, meta: RequestMeta) {
    const email = body.email.toLowerCase();
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (admin && admin.isActive) {
      const otp = this.generateOtp();
      const otpCodeHash = await hash(otp, 10);
      const otpExpMinutes = this.configService.get<number>('OTP_EXP_MINUTES', 5);
      const expiresAt = new Date(Date.now() + otpExpMinutes * 60 * 1000);

      const otpRow = this.otpRepository.create({
        adminId: admin.id,
        email,
        otpCodeHash,
        purpose: 'forgot_password',
        expiresAt,
        usedAt: null,
        attemptCount: 0,
        maxAttempt: AuthService.OTP_MAX_ATTEMPTS,
        requestedIp: meta.ip,
        requestedUserAgent: this.normalizeUserAgent(meta.userAgent),
      });

      await this.otpRepository.save(otpRow); //Saved to AdminOtpCodeEntity 
      await this.sendOtpEmail(email, otp, otpExpMinutes); //OTP mail sent
    }

    return { message: 'If account exists, OTP has been sent to email.' };
  }

  async verifyOtp(body: VerifyOtpDto) {
    const email = body.email.toLowerCase();
    const otpEntry = await this.getLatestActiveOtp(email);

    if (!otpEntry) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpEntry.attemptCount >= otpEntry.maxAttempt) {
      throw new BadRequestException(
        'Maximum OTP attempts reached. Please request a new OTP.',
      );
    }

    const isMatch = await compare(body.otp, otpEntry.otpCodeHash);
    if (!isMatch) {
      otpEntry.attemptCount += 1;
      await this.otpRepository.save(otpEntry);
      throw new BadRequestException('Invalid OTP');
    }

    return { verified: true, message: 'OTP verified. You can now reset password.' };
  }

  // Reset Password
  async resetPassword(body: ResetPasswordDto, meta: RequestMeta) {
    const email = body.email.toLowerCase();
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin || !admin.isActive) {
      throw new BadRequestException('Invalid request');
    }

    const otpEntry = await this.getLatestActiveOtp(email);
    if (!otpEntry) {
      await this.saveResetLog(admin, null, 'failed', 'Invalid or expired OTP', meta);
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpEntry.attemptCount >= otpEntry.maxAttempt) {
      await this.saveResetLog(
        admin,
        otpEntry.id,
        'failed',
        'Maximum OTP attempts reached',
        meta,
      );
      throw new BadRequestException(
        'Maximum OTP attempts reached. Please request a new OTP.',
      );
    }

    const isMatch = await compare(body.otp, otpEntry.otpCodeHash);
    if (!isMatch) {
      otpEntry.attemptCount += 1;
      await this.otpRepository.save(otpEntry);
      await this.saveResetLog(admin, otpEntry.id, 'failed', 'Invalid OTP', meta);
      throw new BadRequestException('Invalid OTP');
    }

    admin.passwordHash = await hash(body.newPassword, 10);
    await this.adminRepository.save(admin);

    otpEntry.usedAt = new Date();
    await this.otpRepository.save(otpEntry);

    await this.saveResetLog(admin, otpEntry.id, 'success', null, meta);

    return { message: 'Password reset successful.' };
  }

  /**
   * Handles logout by instructing the client to remove the JWT token.
   * For stateless JWT auth, this method does not revoke tokens on the server.
   * If using cookies, provide a Set-Cookie header to clear token on client.
   */
  async logout() {
    // Stateless JWT logout: client must delete token.
    return { message: 'Logged out successfully. Please remove token on client.' };
  }

  private async getLatestActiveOtp(email: string): Promise<AdminOtpCodeEntity | null> {
    const now = new Date();
    return this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.email = :email', { email })
      .andWhere('otp.purpose = :purpose', { purpose: 'forgot_password' })
      .andWhere('otp.used_at IS NULL')
      .andWhere('otp.expires_at > :now', { now })
      .orderBy('otp.created_at', 'DESC')
      .getOne();
  }

  private generateOtp(): string {
    const min = 10 ** (AuthService.OTP_LENGTH - 1); // OTP start value
    const max = 10 ** AuthService.OTP_LENGTH - 1;   // OTP highest value
    const value = Math.floor(Math.random() * (max - min + 1)) + min; // random value between min-max
    return `${value}`; // returning value as string
  }

  private async sendOtpEmail(
    email: string,
    otp: string,
    otpExpMinutes: number,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: this.configService.getOrThrow<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });

    await transporter.sendMail({
      from: this.configService.getOrThrow<string>('MAIL_FROM'),
      to: email,
      subject: 'CMAB Password Reset OTP',
      text: `Your OTP is ${otp}. It expires in ${otpExpMinutes} minutes.`,
    });
  }

  private async saveResetLog(
    admin: AdminEntity,
    otpCodeId: string | null,
    status: 'success' | 'failed',
    reason: string | null,
    meta: RequestMeta,
  ): Promise<void> {
    // Prepare a log entry for the password reset action (via OTP)
    const log = this.resetLogRepository.create({
      adminId: admin.id,                 // Reference to admin performing reset
      email: admin.email,                // Admin's email
      resetMethod: 'otp',                // Reset done via OTP method
      otpCodeId,                         // Reference to OTP code (if available)
      status,                            // Outcome: 'success' or 'failed'
      reason,                            // Reason for failure (or null on success)
      ipAddress: meta.ip,                // IP address from which request originated
      userAgent: this.normalizeUserAgent(meta.userAgent), // Browser/User Agent info
    });

    // Save the log entry in the persistent storage
    await this.resetLogRepository.save(log);
  }

  private normalizeUserAgent(value: string | null | string[]): string | null {
    if (!value) return null;
    return Array.isArray(value) ? value.join(' ') : value;
  }
}
