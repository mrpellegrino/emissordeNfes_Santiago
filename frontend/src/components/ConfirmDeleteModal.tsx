import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, X } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #374151;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ModalBody = styled.div`
  padding: 16px 24px 24px 24px;
`;

const Message = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;

  ${props => props.variant === 'danger' ? `
    background: #dc2626;
    color: white;
    border-color: #dc2626;

    &:hover:not(:disabled) {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    &:disabled {
      background: #9ca3af;
      border-color: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #374151;
    border-color: #d1d5db;

    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}
`;

interface ConfirmDeleteModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
    if (e.key === 'Enter') {
      onConfirm();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
      <ModalContainer>
        <ModalHeader>
          <HeaderContent>
            <IconContainer>
              <AlertTriangle size={24} />
            </IconContainer>
            <TitleContainer>
              <ModalTitle>{title}</ModalTitle>
            </TitleContainer>
          </HeaderContent>
          <CloseButton onClick={onCancel}>
            <X />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Message>{message}</Message>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmDeleteModal;
