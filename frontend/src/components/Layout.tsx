import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Receipt, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const Sidebar = styled.aside<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '280px' : '0'};
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  z-index: 1000;

  @media (min-width: 768px) {
    position: relative;
    width: 280px;
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid #e2e8f0;
`;

const Logo = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0 0;
`;

const Nav = styled.nav`
  padding: 20px 0;
`;

const NavItem = styled.button<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border: none;
  background: ${props => props.isActive ? '#f1f5f9' : 'transparent'};
  color: ${props => props.isActive ? '#3b82f6' : '#64748b'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: #f1f5f9;
    color: #3b82f6;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SidebarFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #fecaca;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.sidebarOpen ? '0' : '0'};

  @media (min-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MenuButton = styled.button`
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

  @media (min-width: 768px) {
    display: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Overlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.show ? 'block' : 'none'};

  @media (min-width: 768px) {
    display: none;
  }
`;

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: GraduationCap },
  { path: '/turmas', label: 'Turmas', icon: Users },
  { path: '/alunos', label: 'Alunos', icon: UserCheck },
  { path: '/responsaveis', label: 'Responsáveis', icon: Receipt },
  { path: '/usuarios', label: 'Usuários', icon: Settings, adminOnly: true },
  { path: '/relatorios', label: 'Relatórios', icon: FileText },
];

const Layout: React.FC<LayoutProps> = ({ children, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.tipo === 'admin'
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (tipo: string) => {
    return tipo === 'admin' ? 'Administrador' : 'Operador';
  };

  return (
    <LayoutContainer>
      <Overlay show={sidebarOpen} onClick={closeSidebar} />
      
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>NFSe Santiago</Logo>
          <Subtitle>Sistema de Emissão</Subtitle>
        </SidebarHeader>

        <Nav>
          {filteredMenuItems.map((item) => (
            <NavItem
              key={item.path}
              isActive={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon />
              {item.label}
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <UserInfo>
            <Avatar>
              {getInitials(user?.nome || 'U')}
            </Avatar>
            <UserDetails>
              <UserName>{user?.nome}</UserName>
              <UserRole>{getRoleLabel(user?.tipo || 'operador')}</UserRole>
            </UserDetails>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <LogOut />
            Sair
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent sidebarOpen={sidebarOpen}>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X /> : <Menu />}
            </MenuButton>
            <PageTitle>{title}</PageTitle>
          </div>
        </Header>

        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
