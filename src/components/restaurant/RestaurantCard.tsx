
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  // Função para exibir nível de preço
  const renderPriceLevel = (level: number) => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`${
            index < level ? 'text-restaurant-secondary' : 'text-gray-300'
          }`}
        >
          $
        </span>
      ));
  };

  return (
    <Link to={`/restaurante/${restaurant.id}`}>
      <Card className="overflow-hidden restaurant-card h-full">
        <div className="relative h-48">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {restaurant.featured && (
            <span className="absolute top-2 right-2 bg-restaurant-primary text-white text-xs px-2 py-1 rounded-full">
              Em destaque
            </span>
          )}
        </div>
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold line-clamp-1">{restaurant.name}</h3>
            <div className="flex items-center">
              <span className="text-restaurant-secondary mr-1">★</span>
              <span className="text-sm">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{restaurant.cuisine}</p>
          <p className="text-xs text-gray-400 mt-2 line-clamp-1">{restaurant.address}</p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <div className="text-xs">{renderPriceLevel(restaurant.priceLevel)}</div>
          <div className="text-xs text-gray-500">
            {restaurant.openingHours.opens} - {restaurant.openingHours.closes}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
