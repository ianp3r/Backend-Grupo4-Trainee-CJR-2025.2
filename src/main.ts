import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }
  ));

  // Enable CORS so the Next frontend (running on :3000) can call this API in dev
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Default to 4000 to avoid collision with Next.js dev server on 3000
  const port = process.env.PORT ?? 4000;
  await app.listen(port as any);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}

bootstrap();
