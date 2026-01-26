import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { OrderDetails } from 'src/orderDetails/orderDetails.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Orders {
  @ApiProperty({
    description: 'Id con formato uuid',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Fecha de la creacion de la Orden' })
  @Column()
  date: Date;

  @ApiProperty({ description: 'Relacion con tabla de orderDetails' })
  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.orders, {
    cascade: ['remove'],
  })
  orderDetails: OrderDetails[];

  @ApiProperty({ description: 'Realcion con tabla de users' })
  @ManyToOne(() => Users, (users) => users.orders)
  @JoinColumn({ name: 'userId' })
  user: Users;
}
