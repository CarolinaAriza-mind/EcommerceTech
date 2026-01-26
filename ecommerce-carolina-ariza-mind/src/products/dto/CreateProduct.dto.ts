import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CategoriesDto } from 'src/categories/dto/Categories.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'El nombre del producto debe ser de tipo string y es obligatorio',
    example: 'Logitech G502 Pro',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'La descripcion del producto debe ser de tipo string',
    example: 'The best mouse in the world',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'El precio del producto es obligatorio y debe ser de tipo number',
    example: 299.99,
  })
  price: number;

  @IsNumber()
  @ApiProperty({ description: 'El stock debe ser de tipo number', example: 15 })
  stock: number;

  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'Debe ser un enlace de imagen del producto, de tipo string',
    example: 'https://www.shutterstock.com/image-vector/d',
  })
  imgURL: string;

  @ApiProperty({ example: 'mouse' })
  category: CategoriesDto;
}
