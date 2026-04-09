import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //Adding this line will automatically validate the request body and throw an error if the request body is invalid.
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
