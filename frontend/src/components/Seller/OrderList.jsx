import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { merchantService } from '../../services/merchantService';
import Button from '../common/Button';
import Modal from '../common/Modal';

const OrderListContainer = styled.div`
  padding: 1.5rem;
`;

const OrderFilters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #F9FAFB;
  font-weight: 600;
  color: #374151;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-top: 1px solid #E5E7EB;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background-color: #FEF3C7; color: #92400E;';
      case 'confirmed':
        return 'background-color: #DBEAFE; color: #1E40AF;';
      case 'preparing':
        return 'background-color: #D1FAE5; color: #065F46;';
      case 'ready':
        return 'background-color: #F3F4F6; color: #374151;';
      case 'delivered':
        return 'background-color: #E5E7EB; color: #374151;';
      default:
        return 'background-color: #F3F4F6; color: #374151;';
    }
  }}
`;

const OrderDetails = styled.div`
  margin-top: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #E5E7EB;
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery(
    ['orders', statusFilter],
    () => merchantService.getOrders(statusFilter)
  );

  const updateOrderStatusMutation = useMutation(
    ({ orderId, status }) => merchantService.updateOrderStatus(orderId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      },
    }
  );

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <OrderListContainer>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      <OrderFilters>
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setStatusFilter('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === 'preparing' ? 'primary' : 'secondary'}
          onClick={() => setStatusFilter('preparing')}
        >
          Preparing
        </Button>
        <Button
          variant={statusFilter === 'ready' ? 'primary' : 'secondary'}
          onClick={() => setStatusFilter('ready')}
        >
          Ready
        </Button>
      </OrderFilters>

      <OrderTable>
        <thead>
          <tr>
            <TableHeader>Order ID</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Items</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {orders?.map(order => (
            <tr key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.items.length} items</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <StatusBadge status={order.status}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
                    View
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => handleStatusUpdate(order.id, 'preparing')}
                    >
                      Accept
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      onClick={() => handleStatusUpdate(order.id, 'ready')}
                    >
                      Mark Ready
                    </Button>
                  )}
                </div>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </OrderTable>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <OrderDetails>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Customer Details</h4>
              <p>Name: {selectedOrder.customerName}</p>
              <p>Phone: {selectedOrder.customerPhone}</p>
              {selectedOrder.deliveryAddress && (
                <p>Address: {selectedOrder.deliveryAddress}</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Order Items</h4>
              {selectedOrder.items.map(item => (
                <OrderItem key={item.id}>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </OrderItem>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </OrderDetails>
        )}
      </Modal>
    </OrderListContainer>
  );
};

export default OrderList; 