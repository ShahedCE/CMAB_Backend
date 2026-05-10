import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path/win32';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 app.useGlobalPipes(
    new ValidationPipe({  //Adding this line will automatically validate the request body and throw an error if the request body is invalid.
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  ); 
   app.useStaticAssets(join(__dirname, '..', 'uploads'), { //Serve static files from the 'uploads' directory
    prefix: '/uploads/',
  });
  console.log(`Server is running on port ${process.env.PORT ?? 4000}`);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
