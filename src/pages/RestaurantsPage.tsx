
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RestaurantGrid from '@/components/restaurant/RestaurantGrid';
import { Restaurant } from '@/types';
import { getRestaurants } from '@/services/restaurantService';
import { Search } from 'lucide-react';

const cuisineOptions = ['Todas', 'Italiana', 'Japonesa', 'Brasileira', 'Indiana', 'Francesa', 'Americana', 'Espanhola', 'Portuguesa'];
const priceOptions = ['Todos', '$', '$$', '$$$', '$$$$'];

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('categoria') || 'Todas');
  const [selectedPrice, setSelectedPrice] = useState('Todos');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await getRestaurants();
        setRestaurants(data);
        applyFilters(data);
      } catch (error) {
        console.error('Erro ao buscar restaurantes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams]);

  const applyFilters = (restaurantsToFilter = restaurants) => {
    let filtered = [...restaurantsToFilter];

    // Aplicar filtro de busca
    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar filtro de cozinha
    if (selectedCuisine && selectedCuisine !== 'Todas') {
      filtered = filtered.filter(
        (restaurant) => restaurant.cuisine === selectedCuisine
      );
    }

    // Aplicar filtro de preço
    if (selectedPrice && selectedPrice !== 'Todos') {
      const priceLevel = selectedPrice.length; // Número de $ representa o nível de preço
      filtered = filtered.filter(
        (restaurant) => restaurant.priceLevel === priceLevel
      );
    }

    setFilteredRestaurants(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
    
    // Atualizar parâmetros de URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCuisine !== 'Todas') params.set('categoria', selectedCuisine);
    setSearchParams(params);
  };

  const handleCuisineChange = (value: string) => {
    setSelectedCuisine(value);
    setTimeout(() => applyFilters(), 0);
    
    // Atualizar parâmetros de URL
    const params = new URLSearchParams(searchParams);
    if (value !== 'Todas') {
      params.set('categoria', value);
    } else {
      params.delete('categoria');
    }
    setSearchParams(params);
  };

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
    setTimeout(() => applyFilters(), 0);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-6">Restaurantes</h1>
          
          {/* Filtros */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar restaurantes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCuisine} onValueChange={handleCuisineChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Cozinha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cozinha</SelectLabel>
                    {cuisineOptions.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={selectedPrice} onValueChange={handlePriceChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Faixa de Preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Preço</SelectLabel>
                    {priceOptions.map((price) => (
                      <SelectItem key={price} value={price}>
                        {price}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button type="submit" className="bg-restaurant-primary hover:bg-restaurant-primary/90">
                Filtrar
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4">Carregando restaurantes...</p>
          </div>
        ) : (
          <RestaurantGrid
            restaurants={filteredRestaurants.length > 0 ? filteredRestaurants : restaurants}
            title={`${filteredRestaurants.length} Restaurantes Encontrados`}
            showSearch={false}
          />
        )}
        
        {!isLoading && filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum restaurante encontrado com os filtros aplicados.</p>
            <Button
              variant="link"
              className="text-restaurant-primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('Todas');
                setSelectedPrice('Todos');
                setFilteredRestaurants(restaurants);
                setSearchParams({});
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
