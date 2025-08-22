import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import { usuariosService } from '../services/usuariosService';
import type { Usuario } from '../services/usuariosService';
import UsuarioFormModal from '../components/UsuarioFormModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PageDescription = styled.p`
  color: #64748b;
  font-size: 16px;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FiltersContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const UserCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const UserAvatar = styled.div<{ type: 'admin' | 'operador' }>`
  width: 48px;
  height: 48px;
  background: ${props => props.type === 'admin' 
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
`;

const UserEmail = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 0;
`;

const UserMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const UserRole = styled.span<{ type: 'admin' | 'operador' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.type === 'admin' ? '#fef3c7' : '#dbeafe'};
  color: ${props => props.type === 'admin' ? '#d97706' : '#1d4ed8'};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const UserStatus = styled.span<{ ativo: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.ativo ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.ativo ? '#16a34a' : '#dc2626'};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'warning' | 'success' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: #fee2e2;
          color: #dc2626;
          &:hover { background: #fecaca; }
        `;
      case 'warning':
        return `
          background: #fef3c7;
          color: #d97706;
          &:hover { background: #fde68a; }
        `;
      case 'success':
        return `
          background: #dcfce7;
          color: #16a34a;
          &:hover { background: #bbf7d0; }
        `;
      default:
        return `
          background: #f1f5f9;
          color: #64748b;
          &:hover { background: #e2e8f0; }
        `;
    }
  }}

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #9ca3af;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  margin: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [usuarios, searchTerm, statusFilter, tipoFilter]);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosService.listarUsuarios();
      setUsuarios(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...usuarios];

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(usuario =>
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(usuario =>
        statusFilter === 'ativo' ? usuario.ativo : !usuario.ativo
      );
    }

    // Filtro por tipo
    if (tipoFilter !== 'todos') {
      filtered = filtered.filter(usuario => usuario.tipo === tipoFilter);
    }

    setFilteredUsuarios(filtered);
  };

  const handleCreateUsuario = () => {
    setEditingUsuario(null);
    setShowFormModal(true);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowFormModal(true);
  };

  const handleDeleteUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = async (usuario: Usuario) => {
    try {
      const updatedUsuario = await usuariosService.toggleUsuarioAtivo(usuario.id);
      setUsuarios(prev => prev.map(u => u.id === usuario.id ? updatedUsuario : u));
      toast.success(
        `Usuário ${updatedUsuario.ativo ? 'ativado' : 'desativado'} com sucesso!`
      );
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar status do usuário');
    }
  };

  const handleFormSubmit = async (success: boolean) => {
    if (success) {
      await carregarUsuarios();
    }
    setShowFormModal(false);
    setEditingUsuario(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUsuario) return;

    try {
      await usuariosService.excluirUsuario(selectedUsuario.id);
      setUsuarios(prev => prev.filter(u => u.id !== selectedUsuario.id));
      toast.success('Usuário excluído com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir usuário');
    }

    setShowDeleteModal(false);
    setSelectedUsuario(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (tipo: 'admin' | 'operador') => {
    return tipo === 'admin' ? 'Administrador' : 'Operador';
  };

  const getStatusLabel = (ativo: boolean) => {
    return ativo ? 'Ativo' : 'Inativo';
  };

  return (
    <Layout title="Gestão de Usuários">
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <PageTitle>
              <Users />
              Usuários
            </PageTitle>
            <PageDescription>
              Gerencie os usuários que têm acesso ao sistema
            </PageDescription>
          </HeaderLeft>
          <HeaderActions>
            <CreateButton onClick={handleCreateUsuario}>
              <Plus />
              Novo Usuário
            </CreateButton>
          </HeaderActions>
        </PageHeader>

        <FiltersContainer>
          <FiltersRow>
            <SearchInputWrapper>
              <SearchIcon>
                <Search size={20} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInputWrapper>

            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="ativo">Apenas ativos</option>
              <option value="inativo">Apenas inativos</option>
            </FilterSelect>

            <FilterSelect
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option value="todos">Todos os tipos</option>
              <option value="admin">Administradores</option>
              <option value="operador">Operadores</option>
            </FilterSelect>
          </FiltersRow>
        </FiltersContainer>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : filteredUsuarios.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Users size={32} />
            </EmptyIcon>
            <EmptyTitle>
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
                ? 'Nenhum usuário encontrado'
                : 'Nenhum usuário cadastrado'
              }
            </EmptyTitle>
            <EmptyDescription>
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
                ? 'Tente ajustar os filtros para encontrar outros usuários.'
                : 'Clique em "Novo Usuário" para adicionar o primeiro usuário.'
              }
            </EmptyDescription>
          </EmptyState>
        ) : (
          <UsersGrid>
            {filteredUsuarios.map((usuario) => (
              <UserCard key={usuario.id}>
                <UserHeader>
                  <UserAvatar type={usuario.tipo}>
                    {getInitials(usuario.nome)}
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{usuario.nome}</UserName>
                    <UserEmail>{usuario.email}</UserEmail>
                  </UserInfo>
                </UserHeader>

                <UserMeta>
                  <UserRole type={usuario.tipo}>
                    {getRoleLabel(usuario.tipo)}
                  </UserRole>
                  <UserStatus ativo={usuario.ativo}>
                    {usuario.ativo ? <UserCheck size={12} /> : <UserX size={12} />}
                    {getStatusLabel(usuario.ativo)}
                  </UserStatus>
                </UserMeta>

                <UserActions>
                  <ActionButton onClick={() => handleEditUsuario(usuario)}>
                    <Edit />
                  </ActionButton>
                  <ActionButton
                    variant={usuario.ativo ? 'warning' : 'success'}
                    onClick={() => handleToggleStatus(usuario)}
                  >
                    {usuario.ativo ? <UserX /> : <UserCheck />}
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    onClick={() => handleDeleteUsuario(usuario)}
                  >
                    <Trash2 />
                  </ActionButton>
                </UserActions>
              </UserCard>
            ))}
          </UsersGrid>
        )}
      </PageContainer>

      {showFormModal && (
        <UsuarioFormModal
          usuario={editingUsuario}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {showDeleteModal && selectedUsuario && (
        <ConfirmDeleteModal
          title="Excluir Usuário"
          message={`Tem certeza que deseja excluir o usuário "${selectedUsuario.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </Layout>
  );
};

export default UsuariosPage;
