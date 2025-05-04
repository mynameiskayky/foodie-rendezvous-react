
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { register, loginWithOAuth, oauthProviders } from '@/services/authService';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(name, email, password);
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Redirecionando para a página inicial.',
      });
      onRegisterSuccess();
      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: 'Verifique seus dados e tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = async (providerId: string) => {
    setIsLoading(true);

    try {
      await loginWithOAuth(providerId);
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Redirecionando para a página inicial.',
      });
      onRegisterSuccess();
      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: `Não foi possível criar conta com ${providerId}.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Criar Conta</h2>
        <p className="mt-2 text-sm text-gray-500">
          Cadastre-se para fazer suas reservas
        </p>
      </div>

      {/* Social Registration */}
      <div className="space-y-3">
        {oauthProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            className="w-full justify-center"
            disabled={isLoading}
            onClick={() => handleOAuthRegister(provider.id)}
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
            Cadastrar com {provider.name}
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

      {/* Email Registration */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
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
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoCapitalize="none"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            A senha deve ter pelo menos 8 caracteres
          </p>
        </div>
        <Button
          type="submit"
          className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          Já tem uma conta?{' '}
          <Link to="/login" className="text-restaurant-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
