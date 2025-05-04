
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RestaurantGrid from '@/components/restaurant/RestaurantGrid';
import { Restaurant } from '@/types';
import { getRestaurants, getFeaturedRestaurants } from '@/services/restaurantService';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const [featured, all] = await Promise.all([
          getFeaturedRestaurants(),
          getRestaurants(),
        ]);
        setFeaturedRestaurants(featured);
        setAllRestaurants(all);
      } catch (error) {
        console.error('Erro ao carregar restaurantes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirecionar para a página de busca com o query parameter
    window.location.href = `/restaurantes?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserve seu restaurante favorito</h1>
            <p className="text-lg md:text-xl mb-8">
              Encontre e reserve os melhores restaurantes da sua região com facilidade
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes, cozinhas, localidades..."
                  className="pl-10 h-12 bg-white/90 text-gray-800 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-restaurant-primary hover:bg-restaurant-primary/90">
                Buscar
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Welcome Section for Authenticated Users */}
      {isAuthenticated && user && (
        <section className="bg-gray-50 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Olá, {user.name}!</h2>
                <p className="text-gray-600">Que bom ter você de volta.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link to="/minhas-reservas">
                  <Button variant="outline" className="border-restaurant-primary text-restaurant-primary hover:bg-restaurant-primary hover:text-white">
                    Minhas Reservas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Featured Restaurants */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recomendados para você</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <RestaurantGrid restaurants={featuredRestaurants} title="" />
          )}
          <div className="text-center mt-8">
            <Link to="/restaurantes">
              <Button variant="outline" className="border-restaurant-primary text-restaurant-primary hover:bg-restaurant-primary hover:text-white">
                Ver todos os restaurantes
              </Button>
            </Link>
          </div>
        </section>

        {/* Cuisine Categories */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Explore por categoria</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Italiana', 'Japonesa', 'Brasileira', 'Indiana', 'Francesa', 'Americana'].map((cuisine) => (
              <Link 
                key={cuisine} 
                to={`/restaurantes?categoria=${cuisine}`} 
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition-colors"
              >
                <div className="font-medium">{cuisine}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-8 text-center">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-restaurant-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-restaurant-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Encontre</h3>
              <p className="text-gray-600">Busque restaurantes por local, cozinha ou nome</p>
            </div>
            <div className="text-center">
              <div className="bg-restaurant-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-restaurant-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Reserve</h3>
              <p className="text-gray-600">Escolha o horário e o número de pessoas</p>
            </div>
            <div className="text-center">
              <div className="bg-restaurant-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-restaurant-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Aproveite</h3>
              <p className="text-gray-600">Vá ao restaurante e aproveite sua refeição</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
