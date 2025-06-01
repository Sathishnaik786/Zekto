import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { orderService } from '../../services/orderService';

const TrackingContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatusTimeline = styled.div`
  position: relative;
  margin: 2rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1.5rem;
    height: 100%;
    width: 2px;
    background-color: #E5E7EB;
  }
`;

const StatusItem = styled.div`
  position: relative;
  padding-left: 3rem;
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 1.25rem;
    top: 0.25rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: ${props => props.active ? '#3B82F6' : '#E5E7EB'};
    border: 2px solid white;
  }
`;

const StatusTitle = styled.h4`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: ${props => props.active ? '#1F2937' : '#6B7280'};
`;

const StatusTime = styled.span`
  font-size: 0.875rem;
  color: #6B7280;
`;

const OrderDetails = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;
`;

const OrderTracking = ({ orderId }) => {
  const { data: order, isLoading, error } = useQuery(
    ['order', orderId],
    () => orderService.getOrderDetails(orderId),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) return <div>Loading order details...</div>;
  if (error) return <div>Error loading order details</div>;

  const statuses = [
    { id: 'ordered', label: 'Order Placed' },
    { id: 'confirmed', label: 'Order Confirmed' },
    { id: 'preparing', label: 'Preparing Order' },
    { id: 'ready', label: 'Ready for Pickup' },
    { id: 'picked_up', label: 'Picked Up' },
    { id: 'delivered', label: 'Delivered' }
  ];

  return (
    <TrackingContainer>
      <h3 className="text-xl font-semibold mb-4">Order Status</h3>
      
      <StatusTimeline>
        {statuses.map((status, index) => {
          const isActive = order.status === status.id;
          const statusTime = order.statusTimeline?.[status.id];
          
          return (
            <StatusItem key={status.id} active={isActive}>
              <StatusTitle active={isActive}>{status.label}</StatusTitle>
              {statusTime && (
                <StatusTime>
                  {new Date(statusTime).toLocaleString()}
                </StatusTime>
              )}
            </StatusItem>
          );
        })}
      </StatusTimeline>
      
      <OrderDetails>
        <h4 className="font-semibold mb-2">Order Details</h4>
        <p>Order ID: {order.id}</p>
        <p>Store: {order.storeName}</p>
        <p>Total: ${order.total.toFixed(2)}</p>
        {order.deliveryAddress && (
          <p>Delivery Address: {order.deliveryAddress}</p>
        )}
      </OrderDetails>
    </TrackingContainer>
  );
};

export default OrderTracking; 