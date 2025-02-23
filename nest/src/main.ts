import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Cho phép tất cả domain (nếu cần bảo mật, hãy thay "*" bằng frontend URL)
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Cho phép gửi cookie (nếu cần)
  });
  // Serve static files from 'uploads' directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // app.use((req, res, next) => {
  //   console.log('Middleware - Received Request:', req.method, req.url);
  //   next();
  // });
  //
  //
  // // Cho phép truy cập tệp tĩnh
  // app.use('/generate', express.static(path.join(__dirname, '..', 'uploads')));
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files dynamically from uploads/
  // app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  // app.use(
  //   '/generate/view',
  //   express.static(path.join(__dirname, '..', 'uploads')),
  // );
  await app.listen(8080);
}
bootstrap();
