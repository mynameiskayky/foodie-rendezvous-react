
import { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  title: string;
  showSearch?: boolean;
}

const RestaurantGrid = ({ restaurants, title, showSearch = false }: RestaurantGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {showSearch && (
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar restaurantes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum restaurante encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantGrid;
