import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { merchantService } from '../../services/merchantService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';

const InventoryContainer = styled.div`
  padding: 1.5rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 0.5rem;
`;

const ProductStock = styled.div`
  font-size: 0.875rem;
  color: ${props => props.low ? '#DC2626' : '#6B7280'};
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const InventoryManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery(
    'products',
    () => merchantService.getProducts()
  );

  const updateProductMutation = useMutation(
    (productData) => merchantService.updateProduct(productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setIsModalOpen(false);
      },
    }
  );

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      id: selectedProduct.id,
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      description: formData.get('description'),
    };
    updateProductMutation.mutate(productData);
  };

  if (isLoading) return <div>Loading inventory...</div>;

  return (
    <InventoryContainer>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button onClick={() => {
          setSelectedProduct(null);
          setIsModalOpen(true);
        }}>
          Add New Product
        </Button>
      </div>

      <ProductGrid>
        {products?.map(product => (
          <ProductCard key={product.id}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
            <ProductStock low={product.stock < 10}>
              Stock: {product.stock} units
            </ProductStock>
            <ActionButtons>
              <Button
                variant="secondary"
                onClick={() => handleEdit(product)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => {/* Handle delete */}}
              >
                Delete
              </Button>
            </ActionButtons>
          </ProductCard>
        ))}
      </ProductGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Product Name"
            name="name"
            defaultValue={selectedProduct?.name}
            required
          />
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={selectedProduct?.price}
            required
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            defaultValue={selectedProduct?.stock}
            required
          />
          <Input
            label="Description"
            name="description"
            defaultValue={selectedProduct?.description}
            required
          />
          <div className="mt-4">
            <Button type="submit" fullWidth>
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </InventoryContainer>
  );
};

export default InventoryManager; 