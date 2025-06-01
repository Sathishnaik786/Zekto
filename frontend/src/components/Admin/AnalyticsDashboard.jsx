import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { adminService } from '../../services/adminService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const AnalyticsDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'analyticsStats',
    () => adminService.getAnalyticsStats()
  );

  const { data: revenueData, isLoading: revenueLoading } = useQuery(
    'revenueData',
    () => adminService.getRevenueData()
  );

  const { data: userData, isLoading: userLoading } = useQuery(
    'userData',
    () => adminService.getUserData()
  );

  if (statsLoading || revenueLoading || userLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <DashboardContainer>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      <StatsGrid>
        <StatCard>
          <StatTitle>Total Revenue</StatTitle>
          <StatValue>${stats.totalRevenue.toFixed(2)}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Orders</StatTitle>
          <StatValue>{stats.totalOrders}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Active Users</StatTitle>
          <StatValue>{stats.activeUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Active Merchants</StatTitle>
          <StatValue>{stats.activeMerchants}</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <ChartTitle>Revenue Trend</ChartTitle>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer>
          <ChartTitle>User Distribution</ChartTitle>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData.distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {userData.distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Top Performing Categories</ChartTitle>
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-sm font-medium">
                  {category.name} ({category.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      <ChartContainer>
        <ChartTitle>Recent Activity</ChartTitle>
        <div className="space-y-4">
          {stats.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="text-sm text-gray-500">{activity.type}</span>
            </div>
          ))}
        </div>
      </ChartContainer>
    </DashboardContainer>
  );
};

export default AnalyticsDashboard; 