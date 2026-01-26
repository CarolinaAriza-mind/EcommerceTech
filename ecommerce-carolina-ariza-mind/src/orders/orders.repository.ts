import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './/entities/orders.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { OrderDetails } from 'src/orderDetails/orderDetails.entity';
import { Products } from 'src/products/entities/products.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailRepository: Repository<OrderDetails>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async addOrders(
    userId: string,
    products: { id: string }[],
    logginUserId: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Este usuario con id ${userId}, no existe`);
    }
    const logginUser = await this.userRepository.findOneBy({
      id: logginUserId,
    });
    if (userId !== logginUserId) {
      throw new ForbiddenException(
        'No puedes crear una orden para otro usuario',
      );
    }

    const order = new Orders();
    order.date = new Date();
    order.user = user;

    const newOrder = await this.orderRepository.save(order);

    const foundProducts: Products[] = [];

    for (const item of products) {
      if (!item?.id) continue;

      const product = await this.productsRepository.findOne({
        where: { id: item.id },
      });

      if (!product) {
        throw new NotFoundException(
          `Producto con id ${item.id} no encontrado.`,
        );
      }

      if (product.stock <= 0) {
        throw new BadRequestException(
          `El producto "${product.name}" no tiene stock disponible.`,
        );
      }

      await this.productsRepository.update(
        { id: product.id },
        { stock: product.stock - 1 },
      );

      foundProducts.push(product);
    }

    if (foundProducts.length === 0) {
      throw new BadRequestException('No hay productos válidos en la orden.');
    }

    const total = foundProducts.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    const orderDetails = new OrderDetails();
    orderDetails.orders = newOrder;
    orderDetails.price = Number(total.toFixed(2));
    orderDetails.products = foundProducts;
    const savedDetail = await this.orderDetailRepository.save(orderDetails);

    return {
      orderId: newOrder.id,
      date: newOrder.date,
      orderDetails: {
        orderDetailId: savedDetail.id,
        products: foundProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
        })),
        total: savedDetail.price,
        user: {
          id: user.id,
        },
      },
    };
  }

  async getOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        orderDetails: {
          products: true,
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con id ${orderId} no encontrada.`);
    }

    const orderDetail = order.orderDetails?.[0];
    return {
      orderId: order.id,
      date: order.date,
      orderDetail: {
        orderDetail: orderDetail.id,
        products:
          orderDetail?.products?.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
          })) ?? [],
        total: orderDetail?.price ?? 0,
        user: {
          id: order.user.id,
        },
      },
    };
  }

  async deleteOrder(id: string) {
    const deleteOrder = await this.orderRepository.findOne({
      where: { id },
      relations: { orderDetails: true },
    });
    if (!deleteOrder) {
      throw new NotFoundException(`La orden con ${id} no existe`);
    }

    await this.orderDetailRepository.remove(deleteOrder?.orderDetails);
    await this.orderRepository.remove(deleteOrder);
    return deleteOrder;
  }
}
