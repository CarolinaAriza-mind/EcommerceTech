export interface CreateOrderResponse {
  orderId: string;
  date: Date;
  orderDetails: {
    orderDetailId: string;
    total: number;
    products: {
      id: string;
      name: string;
      price: number;
    }[];
    user: {
      id: string;
    };
  };
}
