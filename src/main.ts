import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://192.168.1.18:8080',
      'http://192.168.1.18:8081',
      '*',
    ], // or wherever your frontend runs
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
