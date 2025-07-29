export interface OrderLine {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderDate: string;
  status: 'PENDING' | 'PAID' | 'CANCELED';
  totalAmount: number;
  customerId: string;
  orderLines: OrderLine[];
}
