import React from 'react';
import styled from 'styled-components';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';

const CartContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E5E7EB;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.span`
  color: #6B7280;
  font-size: 0.875rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background-color: #F3F4F6;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #E5E7EB;
  }
`;

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <CartContainer>
        <p className="text-center text-gray-500">Your cart is empty</p>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
      
      {cart.map(item => (
        <CartItem key={item.id}>
          <ItemDetails>
            <ItemName>{item.name}</ItemName>
            <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
          </ItemDetails>
          
          <QuantityControl>
            <QuantityButton
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </QuantityButton>
            <span>{item.quantity}</span>
            <QuantityButton
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </QuantityButton>
          </QuantityControl>
          
          <button
            onClick={() => removeFromCart(item.id)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </CartItem>
      ))}
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
        
        <Button
          fullWidth
          onClick={() => {/* Handle checkout */}}
        >
          Proceed to Checkout
        </Button>
      </div>
    </CartContainer>
  );
};

export default Cart; 