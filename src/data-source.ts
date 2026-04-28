import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Contact } from './contact/entities/contact.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
  logging: true,
});