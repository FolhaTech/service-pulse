import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Upload } from 'src/generated/prisma/client';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: 'import CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The CSV file to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Import is Ok' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Upload> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.uploadsService.processCsv(file);
  }

  @ApiOperation({ summary: 'List all uploads' })
  @ApiResponse({ status: 200, description: 'List of uploads' })
  @Get()
  async list(): Promise<Upload[]> {
    return this.uploadsService.listUploads();
  }
}
