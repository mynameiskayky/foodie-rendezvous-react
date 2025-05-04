
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  
  // Check if the user is an admin
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user ?? undefined} 
        onLogout={logout} 
        isAdmin={isAdmin} 
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
