import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import Layout from '../components/Layout';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const WelcomeCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
`;

const UserDetails = styled.div`
  h3 {
    margin: 0 0 4px 0;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

const Badge = styled.span<{ type: 'admin' | 'operador' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.type === 'admin' ? '#e3f2fd' : '#f3e5f5'};
  color: ${props => props.type === 'admin' ? '#1976d2' : '#7b1fa2'};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const ActionCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  h4 {
    margin: 0 0 8px 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout title="Dashboard">
      <DashboardContainer>
        <Header>
          <Title>Bem-vindo ao Sistema</Title>
          <Subtitle>Gerencie notas fiscais de serviço com facilidade</Subtitle>
        </Header>

        <WelcomeCard>
          <UserInfo>
            <Avatar>{getInitials(user.nome)}</Avatar>
            <UserDetails>
              <h3>{user.nome}</h3>
              <p>{user.email}</p>
              <Badge type={user.tipo}>{user.tipo}</Badge>
            </UserDetails>
          </UserInfo>
        </WelcomeCard>

        <QuickActions>
          <ActionCard>
            <h4>Turmas</h4>
            <p>Gerenciar turmas e configurações acadêmicas</p>
          </ActionCard>
          
          <ActionCard>
            <h4>Alunos</h4>
            <p>Cadastro e importação de alunos</p>
          </ActionCard>
          
          <ActionCard>
            <h4>Responsáveis</h4>
            <p>Gestão de responsáveis financeiros</p>
          </ActionCard>
          
          <ActionCard>
            <h4>Mensalidades</h4>
            <p>Controle de pagamentos e emissão de notas</p>
          </ActionCard>
          
          {user.tipo === 'admin' && (
            <ActionCard>
              <h4>Usuários</h4>
              <p>Gerenciar usuários do sistema</p>
            </ActionCard>
          )}
        </QuickActions>
      </DashboardContainer>
    </Layout>
  );
};

export default DashboardPage;
