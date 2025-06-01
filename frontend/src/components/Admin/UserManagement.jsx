import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';

const UserManagementContainer = styled.div`
  padding: 1.5rem;
`;

const UserTable = styled.table`
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

const RoleBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.role) {
      case 'admin':
        return 'background-color: #FEE2E2; color: #991B1B;';
      case 'merchant':
        return 'background-color: #DBEAFE; color: #1E40AF;';
      case 'delivery':
        return 'background-color: #D1FAE5; color: #065F46;';
      case 'customer':
        return 'background-color: #F3F4F6; color: #374151;';
      default:
        return 'background-color: #F3F4F6; color: #374151;';
    }
  }}
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return 'background-color: #D1FAE5; color: #065F46;';
      case 'suspended':
        return 'background-color: #FEE2E2; color: #991B1B;';
      case 'pending':
        return 'background-color: #FEF3C7; color: #92400E;';
      default:
        return 'background-color: #F3F4F6; color: #374151;';
    }
  }}
`;

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery(
    ['users', roleFilter],
    () => adminService.getUsers(roleFilter)
  );

  const updateUserMutation = useMutation(
    (userData) => adminService.updateUser(userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setIsModalOpen(false);
      },
    }
  );

  const handleStatusUpdate = (userId, newStatus) => {
    updateUserMutation.mutate({ id: userId, status: newStatus });
  };

  if (isLoading) return <div>Loading users...</div>;

  return (
    <UserManagementContainer>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <Button
            variant={roleFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setRoleFilter('all')}
          >
            All
          </Button>
          <Button
            variant={roleFilter === 'merchant' ? 'primary' : 'secondary'}
            onClick={() => setRoleFilter('merchant')}
          >
            Merchants
          </Button>
          <Button
            variant={roleFilter === 'delivery' ? 'primary' : 'secondary'}
            onClick={() => setRoleFilter('delivery')}
          >
            Delivery
          </Button>
          <Button
            variant={roleFilter === 'customer' ? 'primary' : 'secondary'}
            onClick={() => setRoleFilter('customer')}
          >
            Customers
          </Button>
        </div>
      </div>

      <UserTable>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Joined</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <RoleBadge role={user.role}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </RoleBadge>
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                  >
                    View
                  </Button>
                  {user.status === 'active' ? (
                    <Button
                      variant="danger"
                      onClick={() => handleStatusUpdate(user.id, 'suspended')}
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStatusUpdate(user.id, 'active')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </UserTable>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`User Details - ${selectedUser?.name}`}
      >
        {selectedUser && (
          <div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">User Information</h4>
              <p>Name: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Phone: {selectedUser.phone}</p>
              <p>Role: {selectedUser.role}</p>
              <p>Status: {selectedUser.status}</p>
            </div>

            {selectedUser.role === 'merchant' && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Store Information</h4>
                <p>Store Name: {selectedUser.storeName}</p>
                <p>Address: {selectedUser.storeAddress}</p>
                <p>KYC Status: {selectedUser.kycStatus}</p>
              </div>
            )}

            {selectedUser.role === 'delivery' && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Delivery Information</h4>
                <p>Vehicle Type: {selectedUser.vehicleType}</p>
                <p>License Number: {selectedUser.licenseNumber}</p>
                <p>Rating: {selectedUser.rating}/5</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Account Activity</h4>
              <p>Joined: {new Date(selectedUser.createdAt).toLocaleString()}</p>
              <p>Last Login: {new Date(selectedUser.lastLogin).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </UserManagementContainer>
  );
};

export default UserManagement; 