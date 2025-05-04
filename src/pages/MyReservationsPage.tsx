
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import ReservationCard from '@/components/reservation/ReservationCard';
import { Reservation } from '@/types';
import { getUserReservations, cancelReservation } from '@/services/reservationService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchReservations = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const data = await getUserReservations();
        setReservations(data);
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar reservas',
          description: 'Não foi possível buscar suas reservas. Por favor, tente novamente.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [isAuthenticated, toast]);

  const handleCancelReservation = async (id: string) => {
    try {
      const success = await cancelReservation(id);
      
      if (success) {
        // Atualizar o estado local
        setReservations(
          reservations.map((reservation) =>
            reservation.id === id
              ? { ...reservation, status: 'canceled' }
              : reservation
          )
        );
        
        toast({
          title: 'Reserva cancelada',
          description: 'Sua reserva foi cancelada com sucesso.',
        });
      } else {
        throw new Error('Não foi possível cancelar a reserva');
      }
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao cancelar',
        description: 'Não foi possível cancelar sua reserva. Por favor, tente novamente.',
      });
    }
  };

  // Filtrar reservas por status
  const upcoming = reservations.filter((res) => res.status !== 'canceled');
  const past = reservations.filter((res) => res.status === 'canceled');
  
  // Se o usuário não estiver autenticado, mostrar mensagem
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Você precisa estar logado</h1>
          <p className="text-gray-500 mb-6">Faça login para ver suas reservas</p>
          <Link to="/login">
            <Button className="bg-restaurant-primary hover:bg-restaurant-primary/90">
              Fazer login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold">Minhas Reservas</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4">Carregando suas reservas...</p>
          </div>
        ) : (
          <>
            <Tabs defaultValue="upcoming" className="mb-8">
              <TabsList>
                <TabsTrigger value="upcoming">Ativas ({upcoming.length})</TabsTrigger>
                <TabsTrigger value="past">Canceladas ({past.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="pt-6">
                {upcoming.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Você não tem reservas ativas no momento.</p>
                    <Link to="/restaurantes">
                      <Button className="bg-restaurant-primary hover:bg-restaurant-primary/90">
                        Encontrar restaurantes
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onCancel={handleCancelReservation}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="pt-6">
                {past.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Você não tem reservas canceladas.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onCancel={handleCancelReservation}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;
