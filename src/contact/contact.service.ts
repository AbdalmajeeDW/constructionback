import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { unlinkSync, existsSync } from 'fs';
import * as path from 'path';
@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  
  ) {}


  async createContact(data: CreateContactDto, imagePaths: string[]) {
    try {

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
        status: data.status ?? 'pending',
        isRead: false,
      });

      const savedContact = await this.contactRepository.save(contact);



      return {
        success: true,
        message: 'تم إرسال رسالتك بنجاح',
        data: savedContact,
      };
    } catch (error) {
      console.error('❌ Error saving contact:', error);

      throw new BadRequestException(
        'حدث خطأ أثناء حفظ البيانات، حاول مرة أخرى لاحقًا',
      );
    }
  }





  async getAllContacts() {
    return this.contactRepository.find({
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
    const contact = await this.getContactById(id);

    contact.isRead = true;
    const savedContact = await this.contactRepository.save(contact);

    return { savedContact };
  }


  async updateContactStatus(id: number, status: string) {
    const contact = await this.getContactById(id);

    contact.status = status;
    return this.contactRepository.save(contact);
  }

 async deleteContact(id: string) {
  const contact = await this.contactRepository.findOne({
    where: { id: Number(id) },
  });

  if (!contact) {
    throw new NotFoundException('الرسالة غير موجودة');
  }

  if (contact.images && contact.images.length > 0) {
    for (const image of contact.images) {
      try {
const filePath = path.join(
  process.cwd(),
  image.startsWith('/') ? image.slice(1) : image,
);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      } catch (err) {
        console.error('❌ Failed to delete image:', image, err);
      }
    }
  }

  await this.contactRepository.delete(id);

  return {
    success: true,
    message: 'تم حذف الرسالة مع الصور بنجاح',
  };
}

  async getContactStats() {
    const [total, pending, read, replied] = await Promise.all([
      this.contactRepository.count(),
      this.contactRepository.count({ where: { status: 'pending' } }),
      this.contactRepository.count({ where: { status: 'read' } }),
      this.contactRepository.count({ where: { status: 'replied' } }),
    ]);

    return {
      total,
      pending,
      read,
      replied,
    };
  }


  async searchContacts(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      return this.getAllContacts();
    }

    return this.contactRepository
      .createQueryBuilder('contact')
      .where('contact.firstName LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orWhere('contact.lastName LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orWhere('contact.email LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orWhere('contact.message LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orWhere('contact.straat LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .orderBy('contact.createdAt', 'DESC')
      .getMany();
  }
}