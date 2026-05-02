import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from '../contact/dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private readonly mailService: MailService,
  ) {}

  async createContact(data: CreateContactDto, imagePaths: string[]) {
    try {
      // 1️⃣ حفظ البيانات في قاعدة البيانات
      const contact = this.contactRepository.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,

        postcode: data.postcode,
        straat: data.straat,
        nr: data.nr,
        plaats: data.plaats,

        message: data.message,
        space: data.space,

        images: imagePaths,
        status: data.status ?? "pending",
        isRead: false,
      });

      const savedContact = await this.contactRepository.save(contact);

      this.mailService
        .sendContactEmail({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,

          postcode: data.postcode,
          straat: data.straat,
          nr: data.nr,
          plaats: data.plaats,

          message: data.message,
          space: data.space,

          images: imagePaths,
          contactId: savedContact.id,
        })
        .catch((emailError) => {
          console.error("📧 Email failed (ignored):", emailError.message);
        });

      return {
        success: true,
        message: "تم إرسال رسالتك بنجاح",
        data: savedContact,
      };

    } catch (error) {
      console.error("❌ Error saving contact:", error);

      throw new BadRequestException(
        "حدث خطأ أثناء حفظ البيانات، حاول مرة أخرى لاحقًا"
      );
    }
  }

  async getAllContacts() {
    return await this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getContactById(id: number) {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('الرسالة غير موجودة');
    }

    return contact;
  }

  async putContactById(id: number) {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('الرسالة غير موجودة');
    }

    contact.isRead = true;
    const savedContact = await this.contactRepository.save(contact);

    return {
      savedContact,
    };
  }

  async updateContactStatus(id: number, status: string) {
    const contact = await this.getContactById(id);
    contact.status = status;
    await this.contactRepository.save(contact);
    return contact;
  }

  async deleteContact(id: string) {
    const result = await this.contactRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('الرسالة غير موجودة');
    }

    return { success: true, message: 'تم حذف الرسالة بنجاح' };
  }

  async getContactStats() {
    const total = await this.contactRepository.count();
    const pending = await this.contactRepository.count({
      where: { status: 'pending' },
    });
    const read = await this.contactRepository.count({
      where: { status: 'read' },
    });
    const replied = await this.contactRepository.count({
      where: { status: 'replied' },
    });

    return { total, pending, read, replied };
  }

  async searchContacts(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      return await this.getAllContacts();
    }

    return await this.contactRepository
      .createQueryBuilder('contact')
      .where('contact.name LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('contact.email LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('contact.message LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('contact.street LIKE :keyword', { keyword: `%${keyword}%` })
      .orderBy('contact.createdAt', 'DESC')
      .getMany();
  }
}