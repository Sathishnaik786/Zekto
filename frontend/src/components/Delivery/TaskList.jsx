import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { deliveryService } from '../../services/deliveryService';
import Button from '../common/Button';
import Modal from '../common/Modal';

const TaskListContainer = styled.div`
  padding: 1.5rem;
`;

const TaskFilters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TaskCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TaskTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
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
      case 'accepted':
        return 'background-color: #DBEAFE; color: #1E40AF;';
      case 'picked_up':
        return 'background-color: #D1FAE5; color: #065F46;';
      case 'delivered':
        return 'background-color: #E5E7EB; color: #374151;';
      default:
        return 'background-color: #F3F4F6; color: #374151;';
    }
  }}
`;

const TaskDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  font-weight: 500;
`;

const TaskList = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery(
    ['tasks', statusFilter],
    () => deliveryService.getTasks(statusFilter)
  );

  const updateTaskStatusMutation = useMutation(
    ({ taskId, status }) => deliveryService.updateTaskStatus(taskId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const handleStatusUpdate = (taskId, newStatus) => {
    updateTaskStatusMutation.mutate({ taskId, status: newStatus });
  };

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <TaskListContainer>
      <h2 className="text-2xl font-bold mb-6">Delivery Tasks</h2>

      <TaskFilters>
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
          variant={statusFilter === 'accepted' ? 'primary' : 'secondary'}
          onClick={() => setStatusFilter('accepted')}
        >
          Accepted
        </Button>
        <Button
          variant={statusFilter === 'picked_up' ? 'primary' : 'secondary'}
          onClick={() => setStatusFilter('picked_up')}
        >
          Picked Up
        </Button>
      </TaskFilters>

      {tasks?.map(task => (
        <TaskCard key={task.id}>
          <TaskHeader>
            <TaskTitle>Order #{task.orderId}</TaskTitle>
            <StatusBadge status={task.status}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </StatusBadge>
          </TaskHeader>

          <TaskDetails>
            <DetailItem>
              <DetailLabel>Store</DetailLabel>
              <DetailValue>{task.storeName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Customer</DetailLabel>
              <DetailValue>{task.customerName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Address</DetailLabel>
              <DetailValue>{task.deliveryAddress}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Distance</DetailLabel>
              <DetailValue>{task.distance} km</DetailValue>
            </DetailItem>
          </TaskDetails>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
            >
              View Details
            </Button>
            {task.status === 'pending' && (
              <Button
                onClick={() => handleStatusUpdate(task.id, 'accepted')}
              >
                Accept Task
              </Button>
            )}
            {task.status === 'accepted' && (
              <Button
                onClick={() => handleStatusUpdate(task.id, 'picked_up')}
              >
                Mark as Picked Up
              </Button>
            )}
            {task.status === 'picked_up' && (
              <Button
                onClick={() => handleStatusUpdate(task.id, 'delivered')}
              >
                Mark as Delivered
              </Button>
            )}
          </div>
        </TaskCard>
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Task Details - Order #${selectedTask?.orderId}`}
      >
        {selectedTask && (
          <div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Order Details</h4>
              <p>Store: {selectedTask.storeName}</p>
              <p>Items: {selectedTask.items.length} items</p>
              <p>Total: ${selectedTask.total.toFixed(2)}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Customer Details</h4>
              <p>Name: {selectedTask.customerName}</p>
              <p>Phone: {selectedTask.customerPhone}</p>
              <p>Address: {selectedTask.deliveryAddress}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Delivery Details</h4>
              <p>Distance: {selectedTask.distance} km</p>
              <p>Estimated Time: {selectedTask.estimatedTime} minutes</p>
              <p>Status: {selectedTask.status}</p>
            </div>
          </div>
        )}
      </Modal>
    </TaskListContainer>
  );
};

export default TaskList; 