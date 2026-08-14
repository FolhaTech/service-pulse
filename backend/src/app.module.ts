import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'common/prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, SharedModule, UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
