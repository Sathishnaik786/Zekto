'use client';

import { useState } from 'react';
import { useOrders, useCancelOrder, useRateOrder } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-purple-500',
  ready: 'bg-indigo-500',
  assigned: 'bg-pink-500',
  picked: 'bg-orange-500',
  in_transit: 'bg-cyan-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusIcons = {
  pending: Package,
  confirmed: Package,
  preparing: Package,
  ready: Package,
  assigned: Truck,
  picked: Truck,
  in_transit: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function OrdersPage() {
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const { orders, loading, error, total, page, setPage, refetch } = useOrders({
    status,
    sort,
  });

  const { cancelOrder, loading: cancelling } = useCancelOrder();
  const { rateOrder, loading: rating } = useRateOrder();
  const { toast } = useToast();

  const handleCancelOrder = async (orderId: string, reason: string) => {
    try {
      await cancelOrder(orderId, reason);
      toast({
        title: 'Success',
        description: 'Order cancelled successfully',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to cancel order',
        variant: 'destructive',
      });
    }
  };

  const handleRateOrder = async (orderId: string, rating: { food?: number; delivery?: number; comment?: string }) => {
    try {
      await rateOrder(orderId, rating);
      toast({
        title: 'Success',
        description: 'Thank you for your feedback!',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to submit rating',
        variant: 'destructive',
      });
    }
  };

  const OrderCard = ({ order }: { order: any }) => {
    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
    const [rating, setRating] = useState({ food: 0, delivery: 0, comment: '' });

    return (
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {order.status.replace('_', ' ')}
            </Badge>
            <span className="text-sm text-gray-500">#{order.orderNumber}</span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{order.store.name}</h3>
                <div className="space-y-1">
                  {order.items.map((item: any) => (
                    <div key={item.product._id} className="flex items-center gap-2">
                      <div className="relative w-12 h-12">
                        <Image
                          src={item.product.image || '/placeholder.png'}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-sm">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold">₹{order.totalAmount}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {order.status === 'pending' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Cancel Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Reason for cancellation"
                        onChange={(e) => setRating(prev => ({ ...prev, comment: e.target.value }))}
                      />
                      <Button
                        onClick={() => handleCancelOrder(order._id, rating.comment)}
                        disabled={cancelling}
                      >
                        Confirm Cancellation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {order.status === 'delivered' && !order.rating && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Rate Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rate Your Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Food Rating</label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${
                                rating.food >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                              onClick={() => setRating(prev => ({ ...prev, food: star }))}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Delivery Rating</label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${
                                rating.delivery >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                              onClick={() => setRating(prev => ({ ...prev, delivery: star }))}
                            />
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder="Your feedback (optional)"
                        onChange={(e) => setRating(prev => ({ ...prev, comment: e.target.value }))}
                      />
                      <Button
                        onClick={() => handleRateOrder(order._id, rating)}
                        disabled={rating}
                      >
                        Submit Rating
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="flex gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="picked">Picked</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest First</SelectItem>
              <SelectItem value="createdAt">Oldest First</SelectItem>
              <SelectItem value="totalAmount">Amount: Low to High</SelectItem>
              <SelectItem value="-totalAmount">Amount: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-8">
          {error.message}
        </div>
      )}

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="mb-4">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

          {orders.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No orders found
            </div>
          )}

          {total > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page * 10 >= total}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 