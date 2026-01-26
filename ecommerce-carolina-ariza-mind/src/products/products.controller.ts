import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateProductDto } from './dto/UpdateProducts.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/CreateProduct.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @ApiOperation({ summary: 'Solicitud de todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Productos solicitados',
    type: CreateProductDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Fallo solicitud de productos',
  })
  @ApiResponse({
    status: 404,
    description: 'Productos no encontrados',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Numero de pagina',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Elementos por pagina',
  })
  @Get()
  async getProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<CreateProductDto[]> {
    if (page && limit) {
      return this.productsService.getProducts(Number(page), Number(limit));
    }
    return await this.productsService.getProducts(Number(1), Number(5));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear productos en la base de datos' })
  @ApiResponse({ status: 201, description: 'Productos cargados con exito' })
  @ApiResponse({
    status: 401,
    description: 'Falta token',
  })
  @ApiResponse({
    status: 404,
    description: 'Productos no encontrados',
  })
  @Post('seeder')
  @UseGuards(AuthGuard)
  async addProduct() {
    return await this.productsService.addProducts();
  }

  @Post()
  createProduct(@Body() body: CreateProductDto): Promise<CreateProductDto> {
    return this.productsService.createProduct(body);
  }

  @Get('price')
  findProducts(@Query('price') price: string) {
    return this.productsService.findProducts(price);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Solicitar un producto por Id',
  })
  @ApiParam({ name: 'id', description: 'Id del producto solicitado' })
  @ApiResponse({ status: 200, description: 'Producto solicitado' })
  @ApiResponse({
    status: 401,
    description: 'Falta token',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateProductDto> {
    return await this.productsService.getProductById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Solicitar un producto por Id, para modificarlo en la base de datos',
  })
  @ApiParam({ name: 'id', description: 'Id del producto a modificar' })
  @ApiResponse({ status: 200, description: 'Producto modificado con exito' })
  @ApiResponse({
    status: 401,
    description: 'Falta token',
  })
  @ApiResponse({
    status: 403,
    description: 'Fallo modificacion del producto: solo Administradores',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async upDateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: UpdateProductDto,
  ) {
    const upDateProd = await this.productsService.upDateProduct(id, product);
    if (!this.upDateProduct) return `Este producto con ${id}, no existe`;
    return upDateProd;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Solicitar un producto por Id, para eliminarlo de la base de datos',
  })
  @ApiParam({ name: 'id', description: 'Id del producto a eliminar' })
  @ApiResponse({ status: 200, description: 'Producto eliminado con exito' })
  @ApiResponse({
    status: 401,
    description: 'Falta token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Fallo operacion de eliminacion del producto: solo Administradores',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateProductDto> {
    return await this.productsService.deleteProduct(id);
  }
}
