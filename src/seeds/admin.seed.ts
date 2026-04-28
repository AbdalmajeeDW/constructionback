// seeds/admin.seed.ts
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

export async function seedAdmin(app: INestApplication) {
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  const plainPassword = process.env.ADMIN_PASSWORD || "Abd#9xL$2mP@5nQ&8";
  
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
  } else {
  }
}