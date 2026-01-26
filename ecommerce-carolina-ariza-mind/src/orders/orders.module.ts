import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './/entities/orders.entity';
import { OrderDetails } from 'src/orderDetails/orderDetails.entity';
import { Users } from 'src/users/entities/users.entity';
import { Products } from 'src/products/entities/products.entity';
import { OrderController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepository } from './orders.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, OrderDetails, Users, Products]),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
