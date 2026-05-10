import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ArchiveFilesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    
    // Custom multer configuration for multiple file fields
    const multer = require('multer');
    
    const storage = diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'uploads', 'archive');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });

    const upload = multer({ storage });
    
    // Handle multiple file fields
    upload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'file', maxCount: 1 },
      { name: 'images', maxCount: 10 }
    ])(req, null, () => {
      // Continue to the next handler
    });
    
    return next.handle();
  }
}
