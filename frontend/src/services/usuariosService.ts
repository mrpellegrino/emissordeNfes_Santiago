import api from './api';

// Tipos para o módulo de usuários
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'operador';
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  tipo: 'admin' | 'operador';
}

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: 'admin' | 'operador';
}

export interface UsuariosResponse {
  usuarios: Usuario[];
  total: number;
}

// Serviço de usuários
class UsuariosService {
  private readonly baseUrl = '/usuarios';

  // Listar todos os usuários (apenas admin)
  async listarUsuarios(): Promise<Usuario[]> {
    try {
      const response = await api.get<Usuario[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar usuários:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar usuários'
      );
    }
  }

  // Buscar usuário por ID (apenas admin)
  async buscarUsuario(id: number): Promise<Usuario> {
    try {
      const response = await api.get<Usuario>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar usuário'
      );
    }
  }

  // Criar novo usuário (apenas admin)
  async criarUsuario(dados: CreateUsuarioDto): Promise<Usuario> {
    try {
      const response = await api.post<Usuario>(this.baseUrl, dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.response?.status === 409) {
        throw new Error('Este email já está sendo usado por outro usuário');
      }
      
      if (error.response?.status === 400) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) {
          throw new Error(message.join(', '));
        }
        throw new Error(message || 'Dados inválidos');
      }
      
      throw new Error(
        error.response?.data?.message || 'Erro ao criar usuário'
      );
    }
  }

  // Atualizar usuário (apenas admin)
  async atualizarUsuario(id: number, dados: UpdateUsuarioDto): Promise<Usuario> {
    try {
      const response = await api.patch<Usuario>(`${this.baseUrl}/${id}`, dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.response?.status === 409) {
        throw new Error('Este email já está sendo usado por outro usuário');
      }
      
      if (error.response?.status === 400) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) {
          throw new Error(message.join(', '));
        }
        throw new Error(message || 'Dados inválidos');
      }
      
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar usuário'
      );
    }
  }

  // Excluir usuário (apenas admin)
  async excluirUsuario(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Não é possível excluir o último administrador do sistema');
      }
      
      throw new Error(
        error.response?.data?.message || 'Erro ao excluir usuário'
      );
    }
  }

  // Ativar/Desativar usuário (apenas admin)
  async toggleUsuarioAtivo(id: number): Promise<Usuario> {
    try {
      const response = await api.patch<Usuario>(`${this.baseUrl}/${id}/toggle-active`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao alterar status do usuário:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Não é possível desativar o último administrador do sistema');
      }
      
      throw new Error(
        error.response?.data?.message || 'Erro ao alterar status do usuário'
      );
    }
  }

  // Validar se email já existe (para uso em formulários)
  async validarEmail(email: string, idUsuario?: number): Promise<boolean> {
    try {
      const usuarios = await this.listarUsuarios();
      return !usuarios.some(usuario => 
        usuario.email.toLowerCase() === email.toLowerCase() && 
        usuario.id !== idUsuario
      );
    } catch (error) {
      console.error('Erro ao validar email:', error);
      return true; // Em caso de erro, permite continuar
    }
  }
}

// Exportar instância única do serviço
export const usuariosService = new UsuariosService();
