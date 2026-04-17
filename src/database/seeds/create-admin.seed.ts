import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { AdminEntity } from '../entities/admin.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const adminRepository = app.get<Repository<AdminEntity>>(
      getRepositoryToken(AdminEntity),
    );

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        'Missing ADMIN_NAME, ADMIN_EMAIL or ADMIN_PASSWORD environment variables.',
      );
    }

    const exists = await adminRepository.findOne({ where: { email } });
    if (exists) {
      console.log(`Admin already exists with email: ${email}`);
      return;
    }

    const passwordHash = await hash(password, 10); 
    const admin = adminRepository.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
      lastLoginAt: null,
    });

    await adminRepository.save(admin);
    console.log(`Admin created successfully: ${email}`);
  } 
  finally {
    await app.close();
  }
}

void bootstrap();
