import crypto from 'crypto';
(global as any).crypto = crypto;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common'; // Added Logger here
import { GlobalExceptionFilter } from './common/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP'); // Initialize the logger

  // ✅ ADDED: Middleware to log every activity
  app.use((req, res, next) => {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
  });

  // ✅ Enable CORS for your Frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 🔥 Relaxed validation + allow extra fields
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // 🔥 Global Error Logging
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Photo Share API')
    .setDescription('API documentation for Photo Share app')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📄 Swagger docs available at: http://localhost:${port}/api/swagger`);
}

bootstrap();