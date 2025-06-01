import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #F3F4F6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #EF4444;
`;

const Input = ({
  label,
  error,
  type = 'text',
  ...props
}) => {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput
        type={type}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input; 