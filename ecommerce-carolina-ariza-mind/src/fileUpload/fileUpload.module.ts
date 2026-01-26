import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from './fileUpload.service';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { FileUploadController } from './fileUpload.controller';
import { FileUploadRepository } from './fileUpload.repository';
import { Products } from 'src/products/entities/products.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Products]), AuthModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, CloudinaryConfig, FileUploadRepository],
})
export class FileUploadModule {}
