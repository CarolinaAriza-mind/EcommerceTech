import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async addCategories() {
    return await this.categoriesRepository.addCategories();
  }

  async getCategories() {
    return await this.categoriesRepository.getCategories();
  }
}
