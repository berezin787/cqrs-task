import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(configService.get<number>('HTTP_PORT'));
}
bootstrap();
