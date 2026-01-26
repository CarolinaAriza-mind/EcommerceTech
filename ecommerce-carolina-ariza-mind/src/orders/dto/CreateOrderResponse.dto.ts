import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 'b7c8d9fa-1234-5678-90ab-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'Iphone 15' })
  name: string;

  @ApiProperty({ example: 199.99 })
  price: number;
}
export class UserSummaryDto {
  @ApiProperty({ example: 'df2634da-f28c-46f2-bffd-bb064c388640' })
  id: string;
}

export class OrderDetailsResponseDto {
  @ApiProperty({ example: 'f42b3cd2-3d11-4a52-b893-4e2a739d2b15' })
  orderDetailId: string;

  @ApiProperty({ example: 299.99 })
  total: number;

  @ApiProperty({ type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ type: UserSummaryDto })
  userId: UserSummaryDto;
}

export class CreateOrderResponseDto {
  @ApiProperty({ example: 'ac12ef34-56b7-89d0-1234-56789abcdef0' })
  orderId: string;

  @ApiProperty({ example: '2025-11-15T12:00:00.000Z' })
  date: Date;

  @ApiProperty({ type: OrderDetailsResponseDto })
  orderDetails: OrderDetailsResponseDto;
}
