
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se já estiver autenticado, redirecionar para a página inicial
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    // O usuário foi registrado com sucesso, recarregar o contexto de autenticação
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default RegisterPage;
