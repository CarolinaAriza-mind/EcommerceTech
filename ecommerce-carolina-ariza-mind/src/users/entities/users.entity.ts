import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { describe } from 'node:test';
import { Orders } from 'src/orders/entities/orders.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @ApiProperty({
    description: 'Id de tipo uuid',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:
      'El nombre es de tipo varchar, es obligatorio y no debe contener menos de 50 caracteres',
    example: 'Carolina',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description:
      'El email es obligatorio, debe ser de formato email y unico, tipo varchar y no debe contener mas de 50 caracteres',
    example: 'carolinaariza11@gmail.com',
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty({ description: 'Numero de telefono' })
  @Column({ type: 'int' })
  phone: number;

  @ApiProperty({
    description:
      'Pais de residencia del usuario, de tipo varchar y no debe contener mas de 50 caracteres',
    example: 'Argentina',
  })
  @Column({ type: 'varchar', length: 50 })
  country: string;

  @ApiProperty({
    description: ' Direccion del usuario, de tipo texto',
    example: 'Calle1 n° 123',
  })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({
    description:
      'Nombre de la ciudad de tipo varchar, no debe contener mas de 50 caracteres',
  })
  @Column({ type: 'varchar', length: 50 })
  city: string;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'orderId' })
  orders: Orders[];
}
