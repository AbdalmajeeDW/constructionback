// seeds/admin.seed.ts
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

export async function seedAdmin(app: INestApplication) {
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  const plainPassword = process.env.ADMIN_PASSWORD || "Abd#9xL$2mP@5nQ&8";
    const secondUserPassword = process.env.SECOND_USER_PASSWORD || "Abdul2026!?";

  
  if (!plainPassword) {
    throw new Error('ADMIN_PASSWORD is not defined in environment variables');
  }

  
  const existingAdmin = await userRepo.findOne({
    where: { email: 'adminAbd@admin.com' }, 
  });

  if (!existingAdmin) {
    
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    const admin = userRepo.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'adminAbd@admin.com',
      password: hashedPassword,
      role: 'admin',
    });
    
    await userRepo.save(admin);
  } 
    const existingUser = await userRepo.findOne({
    where: { email: 'secondUser@example.com' }, 
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(secondUserPassword, 10);
    const user = userRepo.create({
      firstName: 'Abd',
      lastName: 'ul',
      email: 'info@amoklusbedrijf.nl',
      password: hashedPassword,
      role: 'admin', 
    });
    await userRepo.save(user);
  }
}
