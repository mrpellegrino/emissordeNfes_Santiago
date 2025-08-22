import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  id: number;
  email: string;
  nome: string;
  tipo: 'admin' | 'operador';
  ativo: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  checkTokenValidity: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Verificar token no localStorage ao inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verificar se o token ainda é válido
          const isValid = await checkTokenValidity();
          if (!isValid) {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, senha: string): Promise<void> => {
    try {
      const response = await authService.login({ email, senha });
      
      // Armazenar token no localStorage
      localStorage.setItem('token', response.access_token);
      
      // Definir usuário logado
      setUser(response.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const checkTokenValidity = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await authService.validateToken();
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  };

  // Auto-logout quando token expira
  useEffect(() => {
    const handleTokenExpiry = () => {
      logout();
    };

    // Interceptar respostas 401 do axios
    const interceptor = authService.setupResponseInterceptor(handleTokenExpiry);

    return () => {
      // Cleanup do interceptor
      authService.removeResponseInterceptor(interceptor);
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkTokenValidity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
