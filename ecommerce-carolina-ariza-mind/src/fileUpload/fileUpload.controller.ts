import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './fileUpload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CloudinaryDto } from 'src/fileUpload/dto/Cloudinary.dto';

@ApiTags('Files')
@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Solicitud de un producto por Id, para modificar la imagen que contiene',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Producto actualizado con la nueva URL de imagen',
    type: CloudinaryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fallo la carga de la imagen',
    type: CloudinaryDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para acceder a esta modificacion',
    type: CloudinaryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Id del producto o archivo de carga, no encontrado ',
    type: CloudinaryDto,
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('uploadImage/:productId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('productId')
    productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'La imagen supera el maximo de peso permitido',
          }),
          new FileTypeValidator({
            fileType: /(.jpg|.png|.svg|.webp|.jpeg)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.fileUploadService.uploadImage(file, productId);
  }
}
