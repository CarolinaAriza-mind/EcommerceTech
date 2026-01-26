import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './/entities/categories.entity';
import { Repository } from 'typeorm';
import data from '../utils/data.json';
import { CategoriesDto } from './dto/Categories.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories(): Promise<CategoriesDto[]> {
    return await this.categoriesRepository.find();
  }

  async addCategories() {
    const categories = Array.from(
      new Set(data.map((element) => element.category)),
    );
    await Promise.all(
      categories.map(async (element) => {
        await this.categoriesRepository
          .createQueryBuilder()
          .insert()
          .into(Categories)
          .values({ name: element })
          .orIgnore()
          .execute();
      }),
    );

    return await this.categoriesRepository.find();
  }
}
