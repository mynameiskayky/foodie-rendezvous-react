import { Restaurant } from '@/types';

// Dados simulados de restaurantes
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    description: 'Autêntica culinária italiana com massas artesanais e ingredientes importados.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
    cuisine: 'Italiana',
    rating: 4.7,
    priceLevel: 3,
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 3456-7890',
    openingHours: {
      opens: '18:00',
      closes: '23:00',
    },
    featured: true,
    ownerId: '1'
  },
  {
    id: '2',
    name: 'Sushi Zen',
    description: 'O melhor da culinária japonesa com peixes frescos selecionados diariamente.',
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    cuisine: 'Japonesa',
    rating: 4.9,
    priceLevel: 4,
    address: 'Av. Paulista, 1500 - Bela Vista',
    phone: '(11) 9876-5432',
    openingHours: {
      opens: '12:00',
      closes: '22:30',
    },
    featured: true,
  },
  {
    id: '3',
    name: 'Sabor Mineiro',
    description: 'Comida típica mineira com aquele gostinho de fazenda.',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    cuisine: 'Brasileira',
    rating: 4.5,
    priceLevel: 2,
    address: 'Rua dos Pinheiros, 578 - Pinheiros',
    phone: '(11) 2345-6789',
    openingHours: {
      opens: '11:30',
      closes: '15:00',
    },
    featured: false,
  },
  {
    id: '4',
    name: 'Tandoor House',
    description: 'Especiarias e sabores autênticos da Índia em um ambiente aconchegante.',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    cuisine: 'Indiana',
    rating: 4.3,
    priceLevel: 3,
    address: 'Alameda Santos, 45 - Jardim Paulista',
    phone: '(11) 3333-4444',
    openingHours: {
      opens: '19:00',
      closes: '23:30',
    },
    featured: false,
  },
  {
    id: '5',
    name: 'Le Bistro',
    description: 'Gastronomia francesa tradicional com toques contemporâneos.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    cuisine: 'Francesa',
    rating: 4.8,
    priceLevel: 4,
    address: 'Rua Oscar Freire, 985 - Jardins',
    phone: '(11) 5555-6666',
    openingHours: {
      opens: '19:30',
      closes: '00:00',
    },
    featured: true,
  },
  {
    id: '6',
    name: 'Burger Joint',
    description: 'Hambúrgueres artesanais com ingredientes selecionados e batatas fritas crocantes.',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    cuisine: 'Americana',
    rating: 4.4,
    priceLevel: 2,
    address: 'Rua Augusta, 256 - Consolação',
    phone: '(11) 7777-8888',
    openingHours: {
      opens: '12:00',
      closes: '00:00',
    },
    featured: false,
  },
  {
    id: '7',
    name: 'Tapas & Vino',
    description: 'Bar de tapas espanholas com uma extensa carta de vinhos importados.',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    cuisine: 'Espanhola',
    rating: 4.6,
    priceLevel: 3,
    address: 'Rua Amauri, 328 - Itaim Bibi',
    phone: '(11) 9999-0000',
    openingHours: {
      opens: '18:30',
      closes: '01:00',
    },
    featured: false,
  },
  {
    id: '8',
    name: 'Cantina do Porto',
    description: 'Frutos do mar frescos preparados com receitas tradicionais portuguesas.',
    image: 'https://images.unsplash.com/photo-1576300291608-d13ed7afb771?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    cuisine: 'Portuguesa',
    rating: 4.5,
    priceLevel: 3,
    address: 'Rua Joaquim Távora, 456 - Vila Mariana',
    phone: '(11) 2222-3333',
    openingHours: {
      opens: '12:00',
      closes: '16:00',
    },
    featured: false,
  },
];

// Função para obter restaurantes
export const getRestaurants = (): Promise<Restaurant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRestaurants);
    }, 500);
  });
};

// Função para obter restaurantes em destaque
export const getFeaturedRestaurants = (): Promise<Restaurant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const featured = mockRestaurants.filter(restaurant => restaurant.featured);
      resolve(featured);
    }, 500);
  });
};

// Função para obter um restaurante pelo ID
export const getRestaurantById = (id: string): Promise<Restaurant | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = mockRestaurants.find(r => r.id === id) || null;
      resolve(restaurant);
    }, 300);
  });
};

// Função para buscar restaurantes
export const searchRestaurants = (query: string): Promise<Restaurant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve(mockRestaurants);
        return;
      }
      
      const queryLower = query.toLowerCase();
      const results = mockRestaurants.filter(
        restaurant => 
          restaurant.name.toLowerCase().includes(queryLower) || 
          restaurant.cuisine.toLowerCase().includes(queryLower) ||
          restaurant.description.toLowerCase().includes(queryLower)
      );
      
      resolve(results);
    }, 300);
  });
};

// Get restaurant by admin ID
export const getRestaurantByAdminId = (adminId: string): Promise<Restaurant | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = mockRestaurants.find(r => r.ownerId === adminId) || null;
      resolve(restaurant);
    }, 300);
  });
};

// Create a new restaurant
export const createRestaurant = (data: Omit<Restaurant, 'id' | 'rating'>): Promise<Restaurant> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRestaurant: Restaurant = {
        ...data,
        id: `rest-${Date.now()}`,
        rating: 0, // New restaurants start with no rating
      };
      
      mockRestaurants.push(newRestaurant);
      resolve(newRestaurant);
    }, 800);
  });
};

// Update restaurant details
export const updateRestaurant = (id: string, data: Partial<Restaurant>): Promise<Restaurant> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRestaurants.findIndex(r => r.id === id);
      
      if (index >= 0) {
        mockRestaurants[index] = { ...mockRestaurants[index], ...data };
        resolve(mockRestaurants[index]);
      } else {
        reject(new Error('Restaurante não encontrado'));
      }
    }, 500);
  });
};
