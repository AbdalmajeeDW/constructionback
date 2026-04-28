// contact/contact.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    MailModule, // استيراد MailModule
  ],
  controllers: [ContactController],
  providers: [ContactService], // MailService يأتي من MailModule
})
export class ContactModule {}
