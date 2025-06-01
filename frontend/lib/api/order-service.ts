import BaseService from './base-service';
import { API_CONFIG } from '../api-config';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
  variant?: {
    name: string;
    value: string;
  };
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  store: {
    _id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  deliveryPerson?: {
    _id: string;
    name: string;
    phoneNumber: string;
  };
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'assigned' | 'picked' | 'in_transit' | 'delivered' | 'cancelled';
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: string;
  }>;
  subtotal: number;
  tax: {
    amount: number;
    rate: number;
  };
  deliveryFee: number;
  discount?: {
    amount: number;
    code?: string;
    type: 'percentage' | 'fixed';
  };
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    instructions?: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi';
  paymentDetails?: {
    transactionId?: string;
    paymentGateway?: string;
    paymentDate?: Date;
    refundDetails?: {
      amount: number;
      reason: string;
      date: Date;
    };
  };
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  cancellationReason?: 'customer_request' | 'store_unavailable' | 'delivery_unavailable' | 'payment_failed' | 'other';
  notes?: {
    customer?: string;
    store?: string;
    delivery?: string;
  };
  rating?: {
    food?: number;
    delivery?: number;
    comment?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

class OrderService extends BaseService {
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<OrderListResponse> {
    return this.get<OrderListResponse>(API_CONFIG.endpoints.order.list, { params });
  }

  async getOrderById(id: string): Promise<Order> {
    return this.get<Order>(API_CONFIG.endpoints.order.details(id));
  }

  async createOrder(data: {
    store: string;
    items: Array<{
      product: string;
      quantity: number;
      variant?: {
        name: string;
        value: string;
      };
      notes?: string;
    }>;
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      location: {
        type: string;
        coordinates: [number, number];
      };
      instructions?: string;
    };
    paymentMethod: 'cash' | 'card' | 'upi';
    notes?: {
      customer?: string;
    };
  }): Promise<Order> {
    return this.post<Order>(API_CONFIG.endpoints.order.create, data);
  }

  async cancelOrder(id: string, reason: string): Promise<Order> {
    return this.post<Order>(API_CONFIG.endpoints.order.cancel(id), { reason });
  }

  async updateOrderStatus(id: string, status: string, note?: string): Promise<Order> {
    return this.patch<Order>(API_CONFIG.endpoints.order.status(id), { status, note });
  }

  async rateOrder(id: string, rating: {
    food?: number;
    delivery?: number;
    comment?: string;
  }): Promise<Order> {
    return this.post<Order>(`${API_CONFIG.endpoints.order.details(id)}/rate`, rating);
  }
}

export const orderService = new OrderService(); 