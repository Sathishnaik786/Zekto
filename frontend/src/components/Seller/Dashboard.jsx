import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { merchantService } from '../../services/merchantService';

const DashboardContainer = styled.div`
  padding: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
`;

const RecentOrders = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #E5E7EB;
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrderStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background-color: #FEF3C7; color: #92400E;';
      case 'preparing':
        return 'background-color: #DBEAFE; color: #1E40AF;';
      case 'ready':
        return 'background-color: #D1FAE5; color: #065F46;';
      default:
        return 'background-color: #F3F4F6; color: #374151;';
    }
  }}
`;

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'merchantStats',
    () => merchantService.getStats()
  );

  const { data: recentOrders, isLoading: ordersLoading } = useQuery(
    'recentOrders',
    () => merchantService.getRecentOrders()
  );

  if (statsLoading || ordersLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <DashboardContainer>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>Today's Orders</StatTitle>
          <StatValue>{stats.todayOrders}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Today's Revenue</StatTitle>
          <StatValue>${stats.todayRevenue.toFixed(2)}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Active Products</StatTitle>
          <StatValue>{stats.activeProducts}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Average Order Value</StatTitle>
          <StatValue>${stats.avgOrderValue.toFixed(2)}</StatValue>
        </StatCard>
      </StatsGrid>
      
      <RecentOrders>
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        
        {recentOrders?.map(order => (
          <OrderItem key={order.id}>
            <div>
              <p className="font-medium">Order #{order.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium">${order.total.toFixed(2)}</span>
              <OrderStatus status={order.status}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </OrderStatus>
            </div>
          </OrderItem>
        ))}
      </RecentOrders>
    </DashboardContainer>
  );
};

export default Dashboard; 