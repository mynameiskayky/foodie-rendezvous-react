import { Reservation } from '@/types';

// Dados simulados de reservas
const mockReservations: Reservation[] = [
  {
    id: '101',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
    date: '15/05/2023',
    time: '19:30',
    partySize: 2,
    status: 'confirmed',
    notes: 'Mesa próxima à janela, por favor',
    customerName: 'João Silva',
    customerEmail: 'joao.silva@example.com',
    customerPhone: '(11) 98765-4321',
  },
  {
    id: '102',
    restaurantId: '5',
    restaurantName: 'Le Bistro',
    restaurantImage: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    date: '22/05/2023',
    time: '20:00',
    partySize: 4,
    status: 'pending',
    customerName: 'Maria Oliveira',
    customerEmail: 'maria.oliveira@example.com',
    customerPhone: '(11) 91234-5678',
  },
  {
    id: '103',
    restaurantId: '2',
    restaurantName: 'Sushi Zen',
    restaurantImage: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
    date: '03/06/2023',
    time: '13:00',
    partySize: 3,
    status: 'canceled',
    notes: 'Aniversário',
    customerName: 'Pedro Santos',
    customerEmail: 'pedro.santos@example.com',
    customerPhone: '(11) 95555-6666',
  },
  {
    id: '104',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
    date: '18/05/2023',
    time: '20:30',
    partySize: 5,
    status: 'pending',
    customerName: 'Ana Rodrigues',
    customerEmail: 'ana.rodrigues@example.com',
    customerPhone: '(11) 98888-7777',
  },
  {
    id: '105',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
    date: '20/05/2023',
    time: '19:00',
    partySize: 2,
    status: 'confirmed',
    customerName: 'Lucas Ferreira',
    customerEmail: 'lucas.ferreira@example.com',
    customerPhone: '(11) 97777-8888',
  },
];

// Função para obter as reservas do usuário atual
export const getUserReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockReservations]);
    }, 500);
  });
};

// Função para criar uma nova reserva
export const createReservation = (reservationData: Omit<Reservation, 'id' | 'status'>): Promise<Reservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReservation: Reservation = {
        ...reservationData,
        id: `res-${Date.now()}`,
        status: 'pending',
      };
      
      mockReservations.push(newReservation);
      resolve(newReservation);
    }, 700);
  });
};

// Função para cancelar uma reserva
export const cancelReservation = (reservationId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservationIndex = mockReservations.findIndex(r => r.id === reservationId);
      
      if (reservationIndex >= 0) {
        mockReservations[reservationIndex].status = 'canceled';
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

// Admin specific functions
export const getRestaurantReservations = (restaurantId: string): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurantReservations = mockReservations.filter(r => r.restaurantId === restaurantId);
      resolve([...restaurantReservations]);
    }, 500);
  });
};

export const updateReservationStatus = (
  reservationId: string, 
  status: 'pending' | 'confirmed' | 'canceled'
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservationIndex = mockReservations.findIndex(r => r.id === reservationId);
      
      if (reservationIndex >= 0) {
        mockReservations[reservationIndex].status = status;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
