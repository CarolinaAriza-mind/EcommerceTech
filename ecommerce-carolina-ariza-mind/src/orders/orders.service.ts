import { Injectable } from '@nestjs/common';
import { OrderRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async addOrders(
    userId: string,
    products: { id: string }[],
    logginUserId: string,
  ) {
    return await this.orderRepository.addOrders(userId, products, logginUserId);
  }

  async getOrder(id: string) {
    return await this.orderRepository.getOrder(id);
  }

  deleteOrder(id: string) {
    return this.orderRepository.deleteOrder(id);
  }
}
