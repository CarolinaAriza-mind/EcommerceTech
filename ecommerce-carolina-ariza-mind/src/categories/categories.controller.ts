import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesDto } from './dto/Categories.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Carga de categorias a la base de datos' })
  @ApiResponse({
    status: 201,
    description: 'Carga exitosa de las categorias',
    type: CategoriesDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Fallo la carga de categorias',
    type: CategoriesDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Categorias no encontradas',
    type: CategoriesDto,
    isArray: true,
  })
  @Get('seeder')
  async addCategories(): Promise<CategoriesDto[]> {
    return await this.categoriesService.addCategories();
  }

  @ApiOperation({ summary: 'Solictud de categorias' })
  @ApiResponse({ status: 200, description: 'Categorias solicitadas con exito' })
  @ApiResponse({ status: 400, description: 'Fallo solicitud de categorias' })
  @ApiResponse({ status: 401, description: 'Falta token de autenticacion' })
  @ApiResponse({ status: 404, description: 'Categorias no encontradas' })
  @Get()
  async getCategories(): Promise<CategoriesDto[]> {
    return await this.categoriesService.getCategories();
  }
}
