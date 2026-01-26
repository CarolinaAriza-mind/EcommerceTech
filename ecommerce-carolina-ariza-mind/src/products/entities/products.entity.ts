import { ApiProperty } from '@nestjs/swagger';
import { Categories } from 'src/categories/entities/categories.entity';
import { OrderDetails } from 'src/orderDetails/orderDetails.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Products {
  @ApiProperty({
    description: 'Id de tipo uuid',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:
      'El nombre del producto es de tipo string, debe ser unico y obligatorio, y no debe contener mas de 50 caracteres',
    example: 'mouse',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'La descripcion del producto debe ser de tipo string',
    example: 'The best mouse in the world',
  })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({
    description:
      'El precio del producto es obligatorio y debe ser de tipo number',
    example: 299.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({ description: 'El stock debe ser de tipo number', example: 15 })
  @Column({ type: 'int', nullable: false })
  stock: number;

  @ApiProperty({
    description: 'Debe ser un enlace de imagen del producto, de tipo string',
    example: 'https://www.shutterstock.com/image-vector/d',
  })
  @Column({
    type: 'text',
    default:
      'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg',
  })
  imgURL: string;

  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  @JoinTable({
    name: 'OrderDetails_Products',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'orderDetails_id',
      referencedColumnName: 'id',
    },
  })
  orderDetails: OrderDetails[];
}
