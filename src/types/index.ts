
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
  restaurantId?: string; // If admin, which restaurant they manage
  phone?: string;
  address?: string;
  bio?: string;
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
  ownerId?: string; // Added to link restaurant with owner
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
  customerName?: string; // Added for admin view
  customerPhone?: string; // Added for admin view
  customerEmail?: string; // Added for admin view
}
