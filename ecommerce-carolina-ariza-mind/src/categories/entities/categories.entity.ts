import { ApiProperty } from '@nestjs/swagger';
import { Products } from 'src/products/entities/products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Categories {
  @ApiProperty({
    description: 'Id con formato uuid',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:
      'El nombre de la categoria es obligatorio, de tipo string y no puede contener mas e 50 caracteres',
    example: 'mouse',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @ApiProperty({ description: 'Relacion con la tabla de Productos' })
  @OneToMany(() => Products, (product) => product.category)
  @JoinColumn({ name: 'product_id' })
  products: Products[];
}
