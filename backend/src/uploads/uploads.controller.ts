import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Upload } from 'src/generated/prisma/client';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Upload> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.uploadsService.processCsv(file);
  }

  @Get()
  async list(): Promise<Upload[]> {
    return this.uploadsService.listUploads();
  }
}
