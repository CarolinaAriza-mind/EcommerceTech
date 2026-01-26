import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { UpdateProductDto } from './dto/UpdateProducts.dto';
import { CreateProductDto } from './dto/CreateProduct.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProducts(page: number, limit: number) {
    return await this.productsRepository.getProducts(page, limit);
  }

  async getProductById(id: string) {
    return await this.productsRepository.getProductById(id);
  }

  async findProducts(price: string) {
    return await this.productsRepository.findProducts(price);
  }

  createProduct(createProduct: CreateProductDto) {
    return this.productsRepository.createProduct(createProduct);
  }

  async addProducts() {
    return await this.productsRepository.addProducts();
  }

  async upDateProduct(id: string, product: UpdateProductDto) {
    return await this.productsRepository.upDateProduct(id, product);
  }

  async deleteProduct(id: string) {
    return await this.productsRepository.deleteProduct(id);
  }
}
