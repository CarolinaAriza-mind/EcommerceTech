import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Orders } from 'src/orders/entities/orders.entity';
import { Products } from 'src/products/entities/products.entity';

export class OrderDetailsDto {
  @ApiProperty({
    description: 'Precio total de la orden. Es de tipo decimal y obligatorio',
  })
  price: number;

  @ApiProperty({
    description: 'Id con formato uuid',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @IsUUID()
  orderId: Partial<Orders>[];

  @ApiProperty({ description: 'Relacion con la tabla de Products' })
  @IsUUID()
  productId: Partial<Products>[];
}
