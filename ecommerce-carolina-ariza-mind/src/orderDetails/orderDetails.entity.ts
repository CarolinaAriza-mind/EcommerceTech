import { ApiProperty } from '@nestjs/swagger';
import { Orders } from 'src/orders/entities/orders.entity';
import { Products } from 'src/products/entities/products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'OrderDetails' })
export class OrderDetails {
  @ApiProperty({
    description: 'Id con formato uuid',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Precio total de la orden. Es de tipo decimal' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({ description: 'Relacion con la tabla de Orders' })
  @ManyToOne(() => Orders, (order) => order.orderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  orders: Orders;

  @ApiProperty({ description: 'Relacion con la tabla de Products' })
  @ManyToMany(() => Products, (product) => product.orderDetails)
  products: Products[];
}
