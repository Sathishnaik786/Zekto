import { useState, useEffect } from 'react';
import { orderService, Order, OrderListResponse } from '../lib/api/order-service';

interface UseOrdersOptions {
  page?: number;
  limit?: number;
  status?: string;
  sort?: string;
  startDate?: Date;
  endDate?: Date;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);
  const [limit] = useState(options.limit || 10);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getOrders({
        page,
        limit,
        status: options.status,
        sort: options.sort,
        startDate: options.startDate,
        endDate: options.endDate
      });

      setOrders(response.orders);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [
    page,
    limit,
    options.status,
    options.sort,
    options.startDate,
    options.endDate
  ]);

  const refetch = () => {
    fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    total,
    page,
    setPage,
    refetch
  };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch order'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  return { order, loading, error };
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const createOrder = async (data: {
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
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.createOrder(data);
      setOrder(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create order'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, order };
}

export function useCancelOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelOrder = async (id: string, reason: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.cancelOrder(id, reason);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel order'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cancelOrder, loading, error };
}

export function useRateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const rateOrder = async (id: string, rating: {
    food?: number;
    delivery?: number;
    comment?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.rateOrder(id, rating);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to rate order'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { rateOrder, loading, error };
} 