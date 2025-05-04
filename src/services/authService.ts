
import { User } from '@/types';

// Simular dados de usuário para desenvolvimento
const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@exemplo.com',
  avatar: 'https://i.pravatar.cc/150?img=3',
};

// Simulação de login com oauth providers
export const oauthProviders = [
  { id: 'google', name: 'Google', icon: 'google.svg' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook.svg' },
  { id: 'apple', name: 'Apple', icon: 'apple.svg' },
];

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simular verificação de credenciais
    setTimeout(() => {
      if (email && password) {
        // Armazenar token no localStorage (na implementação real seria um JWT)
        localStorage.setItem('auth_token', 'mock_jwt_token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve(mockUser);
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    }, 1000);
  });
};

export const loginWithOAuth = (providerId: string): Promise<User> => {
  return new Promise((resolve) => {
    // Simular login OAuth
    setTimeout(() => {
      console.log(`Login com provider ${providerId}`);
      localStorage.setItem('auth_token', `mock_jwt_token_${providerId}`);
      localStorage.setItem('user', JSON.stringify(mockUser));
      resolve(mockUser);
    }, 1000);
  });
};

export const register = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    // Simular registro de usuário
    setTimeout(() => {
      const newUser = { ...mockUser, name, email };
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('user', JSON.stringify(newUser));
      resolve(newUser);
    }, 1000);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    // Limpar tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    resolve();
  });
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      resolve(JSON.parse(userData));
    } else {
      resolve(null);
    }
  });
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};
