import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
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
}
