import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { seedAdmin } from './seeds/admin.seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🌐 CORS (production + dev)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://rivoaannemerbedrijf.nl',
      'https://www.rivoaannemerbedrijf.nl',
      'https://api.rivoaannemerbedrijf.nl',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // 📁 static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 🧠 body limit
  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '10mb' });

  // 🔒 validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ⚠️ seed فقط في development (مهم جدًا)
  if (process.env.NODE_ENV !== 'production') {
    await seedAdmin(app);
  }

  // 🚀 port من environment
  const port = process.env.PORT || 4000;

  await app.listen(port);
}

bootstrap();