import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do backend
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o token for inválido, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos de resposta da API
interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nome: string;
    tipo: 'admin' | 'operador';
    ativo: boolean;
  };
}

interface ValidateTokenResponse {
  user: {
    id: number;
    email: string;
    nome: string;
    tipo: 'admin' | 'operador';
    ativo: boolean;
  };
}

// Serviços de autenticação
export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async validateToken(): Promise<ValidateTokenResponse> {
    const response = await api.post('/auth/validate-token');
    return response.data;
  },

  async getProfile(): Promise<ValidateTokenResponse> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Setup interceptor para auto-logout
  setupResponseInterceptor(onTokenExpiry: () => void): number {
    return api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          onTokenExpiry();
        }
        return Promise.reject(error);
      }
    );
  },

  // Remover interceptor
  removeResponseInterceptor(interceptorId: number): void {
    api.interceptors.response.eject(interceptorId);
  }
};

export default api;
