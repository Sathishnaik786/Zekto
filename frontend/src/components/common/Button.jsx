import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  
  ${props => props.variant === 'primary' && `
    background-color: #3B82F6;
    color: white;
    border: none;
    &:hover {
      background-color: #2563EB;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: white;
    color: #4B5563;
    border: 1px solid #D1D5DB;
    &:hover {
      background-color: #F3F4F6;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: #EF4444;
    color: white;
    border: none;
    &:hover {
      background-color: #DC2626;
    }
  `}
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 