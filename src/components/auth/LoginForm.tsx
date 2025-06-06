
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { login, loginWithOAuth, oauthProviders } from '@/services/authService';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando para a página inicial.',
      });
      onLoginSuccess();
      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: 'Verifique seu e-mail e senha e tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (providerId: string) => {
    setIsLoading(true);

    try {
      await loginWithOAuth(providerId);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando para a página inicial.',
      });
      onLoginSuccess();
      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: `Não foi possível fazer login com ${providerId}.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
        <p className="mt-2 text-sm text-gray-500">
          Faça login para continuar
        </p>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        {oauthProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            className="w-full justify-center"
            disabled={isLoading}
            onClick={() => handleOAuthLogin(provider.id)}
          >
            <img 
              src={`/assets/${provider.icon}`} 
              alt={provider.name} 
              className="w-5 h-5 mr-2"
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.style.display = 'none';
              }}
            />
            Continuar com {provider.name}
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      {/* Email/Password Login */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            placeholder="seu.email@exemplo.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              to="/esqueci-senha"
              className="text-xs text-restaurant-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoCapitalize="none"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="text-restaurant-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
