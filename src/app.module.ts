// app.module.ts
import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/entities/contact.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Contact],
  synchronize: false,
  logging: true,
}),
    AuthModule,
    UserModule,
    ContactModule,
  ],
})
export class AppModule {}
