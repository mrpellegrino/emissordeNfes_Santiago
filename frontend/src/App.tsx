import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsuariosPage from './pages/UsuariosPage';
import { GlobalStyle } from './styles/global';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas futuras para turmas, alunos, etc. */}
          <Route 
            path="/turmas" 
            element={
              <ProtectedRoute>
                <div>Página de Turmas (Em desenvolvimento)</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/alunos" 
            element={
              <ProtectedRoute>
                <div>Página de Alunos (Em desenvolvimento)</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/responsaveis" 
            element={
              <ProtectedRoute>
                <div>Página de Responsáveis (Em desenvolvimento)</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/usuarios" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UsuariosPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota raiz redireciona para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
