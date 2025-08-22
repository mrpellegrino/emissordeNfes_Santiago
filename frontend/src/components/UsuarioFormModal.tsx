import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usuariosService } from '../services/usuariosService';
import type { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../services/usuariosService';

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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #374151;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const PasswordInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 44px 12px 16px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
`;

const HelperText = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;

    &:hover:not(:disabled) {
      background: #2563eb;
      border-color: #2563eb;
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

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface UsuarioFormModalProps {
  usuario?: Usuario | null;
  onClose: () => void;
  onSubmit: (success: boolean) => void;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
}

const UsuarioFormModal: React.FC<UsuarioFormModalProps> = ({
  usuario,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'operador' as 'admin' | 'operador'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEditing = !!usuario;

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '',
        tipo: usuario.tipo
      });
    }
  }, [usuario]);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    } else {
      // Verificar se email já existe
      const emailExists = await usuariosService.validarEmail(
        formData.email,
        usuario?.id
      );
      if (!emailExists) {
        newErrors.email = 'Este email já está sendo usado por outro usuário';
      }
    }

    // Validação da senha
    if (!isEditing && !formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validação do tipo
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      if (isEditing) {
        const updateData: UpdateUsuarioDto = {
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          tipo: formData.tipo
        };

        // Só incluir senha se foi preenchida
        if (formData.senha) {
          updateData.senha = formData.senha;
        }

        await usuariosService.atualizarUsuario(usuario!.id, updateData);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        const createData: CreateUsuarioDto = {
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          senha: formData.senha,
          tipo: formData.tipo
        };

        await usuariosService.criarUsuario(createData);
        toast.success('Usuário criado com sucesso!');
      }

      onSubmit(true);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar usuário');
      onSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <User />
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="nome">
                <User />
                Nome completo
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite o nome completo"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                hasError={!!errors.nome}
              />
              {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">
                <Mail />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite o email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                hasError={!!errors.email}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="senha">
                <Lock />
                {isEditing ? 'Nova senha (opcional)' : 'Senha'}
              </Label>
              <InputWrapper>
                <PasswordInput
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isEditing ? 'Deixe em branco para manter a atual' : 'Digite uma senha'}
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  hasError={!!errors.senha}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </PasswordToggle>
              </InputWrapper>
              {errors.senha && <ErrorMessage>{errors.senha}</ErrorMessage>}
              {!isEditing && (
                <HelperText>A senha deve ter pelo menos 6 caracteres</HelperText>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tipo">
                <Shield />
                Tipo de usuário
              </Label>
              <Select
                id="tipo"
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value as 'admin' | 'operador')}
                hasError={!!errors.tipo}
              >
                <option value="operador">Operador</option>
                <option value="admin">Administrador</option>
              </Select>
              {errors.tipo && <ErrorMessage>{errors.tipo}</ErrorMessage>}
              <HelperText>
                {formData.tipo === 'admin' 
                  ? 'Administradores podem gerenciar usuários e todas as funcionalidades'
                  : 'Operadores têm acesso limitado às funcionalidades do sistema'
                }
              </HelperText>
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              isEditing ? 'Atualizar' : 'Criar Usuário'
            )}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default UsuarioFormModal;
