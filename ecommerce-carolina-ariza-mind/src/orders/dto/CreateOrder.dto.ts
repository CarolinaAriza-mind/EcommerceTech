import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class ProductIdDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 'b7c8d9fa-1234-5678-90ab-1234567890ab',
  })
  @IsString()
  id: string;
}
export class CreateOrderDto {
  @ApiProperty({
    description: 'ID del usuario que crea la orden',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Listado de productos (solo requiere el ID)',
    type: () => [ProductIdDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductIdDto)
  products: ProductIdDto[];
}
