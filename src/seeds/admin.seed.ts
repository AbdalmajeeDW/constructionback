// seeds/admin.seed.ts
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

export async function seedAdmin(app: INestApplication) {
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  const plainPassword =
    process.env.ADMIN_PASSWORD || "Abd#9xL$2mP@5nQ&8";

  const secondUserPassword =
    process.env.SECOND_USER_PASSWORD || "Abdul2026!?";

  if (!plainPassword) {
    throw new Error('ADMIN_PASSWORD is not defined');
  }

  const adminPasswordHash = await bcrypt.hash(plainPassword, 10);
  const userPasswordHash = await bcrypt.hash(secondUserPassword, 10);

  await userRepo.upsert(
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'adminAbd@admin.com',
      password: adminPasswordHash,
      role: 'admin',
    },
    ['email']
  );

  await userRepo.upsert(
    {
      firstName: 'Abd',
      lastName: 'ul',
      email: 'info@amoklusbedrijf.nl',
      password: userPasswordHash,
      role: 'admin',
    },
    ['email']
  );
}
