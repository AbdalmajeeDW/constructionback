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

import sharp from 'sharp';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import * as path from 'path';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new Error('Only images are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createContact(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    const finalPaths: string[] = [];

    const outputDir = './uploads/contacts';

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // 🚀 معالجة الصور بشكل متوازي (أسرع بكثير)
    await Promise.all(
      (files || []).map(async (file) => {
        const inputPath = file.path;

        const fileName = `compressed-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.webp`;

        const outputPath = path.join(outputDir, fileName);

        await sharp(inputPath)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality: 75,
            effort: 1,
          })
          .toFile(outputPath);

        // 🧹 حذف الملف الأصلي
        unlinkSync(inputPath);

        finalPaths.push(`/${outputPath}`);
      }),
    );

    return this.contactService.createContact(body, finalPaths);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllContacts() {
    return this.contactService.getAllContacts();
  }

  @Get('stats')
  async getStats() {
    return this.contactService.getContactStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchContacts(@Query('q') keyword: string) {
    return this.contactService.searchContacts(keyword);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getContact(@Param('id') id: number) {
    return this.contactService.getContactById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateContact(@Param('id') id: number) {
    return this.contactService.putContactById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    return this.contactService.updateContactStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(id);
  }
}