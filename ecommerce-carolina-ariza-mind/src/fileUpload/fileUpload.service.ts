import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './fileUpload.repository';
import { Repository } from 'typeorm';
import { Products } from 'src/products/entities/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductResponseDto } from 'src/orders/dto/CreateOrderResponse.dto';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    productId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product)
      throw new NotFoundException(
        `Producto con id ${productId}, no encontrado`,
      );
    const response = await this.fileUploadRepository.uploadImage(file);
    if (!response.secure_url)
      throw new NotFoundException(
        `Error al cargar el archivo ${JSON.stringify(file)} de Cloudinary`,
      );

    await this.productsRepository.update(productId, {
      imgURL: response.secure_url,
    });

    const upDatedProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (!upDatedProduct) {
      throw new NotFoundException(`Producto con id ${productId} no encontrado`);
    }
    return upDatedProduct;
  }
}
