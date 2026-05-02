// contact/contact.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ContactService } from './contact.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}
 @Post()
  @Post()
@UseInterceptors(
FilesInterceptor('images', 5, { // ❗ بدل 1000
  storage: diskStorage({
    destination: './uploads/contacts',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // ❗ 5MB كحد أقصى
    files: 5, // ❗ منطقي
  },
})
)
  async createContact(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    const imagePaths =
      files?.map((file) => `/uploads/contacts/${file.filename}`) || [];
    return await this.contactService.createContact(body, imagePaths);
  }
 
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllContacts() {
    return await this.contactService.getAllContacts();
  }

  @Get('stats')
  async getStats() {
    return await this.contactService.getContactStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchContacts(@Query('q') keyword: string) {
    return await this.contactService.searchContacts(keyword);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getContact(@Param('id') id: number) {
    return await this.contactService.getContactById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateContact(@Param('id') id: number) {
    return await this.contactService.putContactById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return await this.contactService.updateContactStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    return await this.contactService.deleteContact(id);
  }
}
