// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';
import { MailModule } from './mail/mail.module';
import { Contact } from './contact/entities/contact.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
TypeOrmModule.forRoot({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'mntkiuuh',
  password: 'abde221',
  database: 'contact_db',
  entities: [User, Contact],
  synchronize: true,
  logging: true,
}),
    AuthModule,
    UserModule,
    MailModule,
    ContactModule,
  ],
})
export class AppModule {}
