import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './/entities/products.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Categories } from 'src/categories/entities/categories.entity';
import data from '../utils/data.json';
import { UpdateProductDto } from './dto/UpdateProducts.dto';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(page: number, limit: number): Promise<CreateProductDto[]> {
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });
    const start = page * limit - 1;
    const end = start + limit;
    products = products.slice(start, end);
    return products;
  }

  async getProductById(id: string): Promise<CreateProductDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Usuario con id ${id}, no encontrado`);
    }
    return product;
  }

  async findProducts(price: string) {
    const lowerPriceProd = await this.productsRepository.find({
      where: { price: LessThan(50) },
    });
    return lowerPriceProd;
  }

  async createProduct(createProduct: CreateProductDto) {
    const product = this.productsRepository.create({
      name: createProduct.name,
      description: createProduct.description,
      stock: createProduct.stock,
      price: createProduct.price,
      category: createProduct.category,
    });
    return await this.productsRepository.save(product);
  }

  async addProducts() {
    const categories = await this.categoriesRepository.find();
    await Promise.all(
      data.map(async (element) => {
        const category = categories.find(
          (category) =>
            category.name.toLowerCase() === element.category.toLowerCase(),
        );
        if (!category)
          throw new NotFoundException(
            `La categoria ${element.category} no existe`,
          );
        const product = new Products();
        product.name = element.name;
        product.description = element.description;
        product.price = element.price;
        product.stock = element.stock;
        product.category = category;

        await this.productsRepository
          .createQueryBuilder()
          .insert()
          .into(Products)
          .values(product)
          .orUpdate(['description', 'price', 'stock', 'imgURL'], ['name'])
          .execute();
      }),
    );
    return await this.productsRepository.find();
  }

  async upDateProduct(id: string, product: UpdateProductDto) {
    await this.productsRepository.update(id, product);
    const upDateProdu = this.productsRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
    return upDateProdu;
  }

  async deleteProduct(id: string): Promise<CreateProductDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Este ${product} no existe`);
    }
    await this.productsRepository.delete(id);
    return product;
  }
}
