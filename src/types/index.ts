
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4;
  address: string;
  phone: string;
  openingHours: {
    opens: string;
    closes: string;
  };
  featured?: boolean;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'canceled';
  notes?: string;
}
