
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getRestaurantByAdminId } from '@/services/restaurantService';
import { getRestaurantReservations } from '@/services/reservationService';
import { Reservation, Restaurant } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminReservationItem from '@/components/admin/AdminReservationItem';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, CalendarClock, Clock } from 'lucide-react';

const AdminDashboardPage = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || user?.role !== 'admin') {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        // In a real app, we'd use the user's restaurantId to get their restaurant
        const restaurantData = await getRestaurantByAdminId(user?.id || '');
        
        if (restaurantData) {
          setRestaurant(restaurantData);
          const reservationsData = await getRestaurantReservations(restaurantData.id);
          setReservations(reservationsData);
        } else {
          toast({
            variant: 'destructive',
            title: 'Restaurante não encontrado',
            description: 'Não foi possível carregar os dados do seu restaurante.',
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do restaurante:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar dados',
          description: 'Ocorreu um erro ao buscar as informações.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user, navigate, toast]);

  const handleReservationStatusChange = async () => {
    // Reload reservations after status change
    if (restaurant) {
      try {
        const updatedReservations = await getRestaurantReservations(restaurant.id);
        setReservations(updatedReservations);
      } catch (error) {
        console.error('Erro ao recarregar reservas:', error);
      }
    }
  };

  // Filter reservations by status
  const pending = reservations.filter(res => res.status === 'pending');
  const confirmed = reservations.filter(res => res.status === 'confirmed');
  const canceled = reservations.filter(res => res.status === 'canceled');
  
  // Group today's reservations
  const today = new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  const todayReservations = reservations.filter(
    res => res.status === 'confirmed' && res.date === today
  );

  // Admin not authenticated or doesn't have the right role
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Acesso não autorizado</h1>
          <p className="text-gray-500 mb-6">Você precisa ser um administrador para acessar esta página</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-white">Painel do Restaurante</h1>
          {restaurant && (
            <h2 className="text-xl font-medium text-white/80 mt-2">
              {restaurant.name}
            </h2>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-500">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CalendarClock className="mr-2 h-5 w-5 text-purple-500" />
                Reservas para Hoje
              </h3>
              <div className="text-3xl font-bold text-purple-600">
                {todayReservations.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {todayReservations.length === 0 ? 'Não há reservas hoje' : 'Reservas confirmadas'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                Reservas Pendentes
              </h3>
              <div className="text-3xl font-bold text-yellow-600">
                {pending.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Aguardando confirmação
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-500" />
                Total de Reservas
              </h3>
              <div className="text-3xl font-bold text-green-600">
                {confirmed.length + pending.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Ativas no momento
              </div>
            </div>
          </div>

          {todayReservations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Reservas de Hoje</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pessoas</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayReservations
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.time}</TableCell>
                        <TableCell>{reservation.customerName}</TableCell>
                        <TableCell>{reservation.partySize}</TableCell>
                        <TableCell>{reservation.customerPhone}</TableCell>
                        <TableCell>{reservation.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Gerenciar Reservas</h3>
            </div>
            <Tabs defaultValue="pending" className="px-6 pb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
                  Pendentes ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  Confirmadas ({confirmed.length})
                </TabsTrigger>
                <TabsTrigger value="canceled" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
                  Canceladas ({canceled.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {pending.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Não há reservas pendentes no momento.
                  </div>
                ) : (
                  <div>
                    {pending.map(reservation => (
                      <AdminReservationItem 
                        key={reservation.id} 
                        reservation={reservation}
                        onStatusChange={handleReservationStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="confirmed">
                {confirmed.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Não há reservas confirmadas no momento.
                  </div>
                ) : (
                  <div>
                    {confirmed.map(reservation => (
                      <AdminReservationItem 
                        key={reservation.id} 
                        reservation={reservation}
                        onStatusChange={handleReservationStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="canceled">
                {canceled.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Não há reservas canceladas no momento.
                  </div>
                ) : (
                  <div>
                    {canceled.map(reservation => (
                      <AdminReservationItem 
                        key={reservation.id} 
                        reservation={reservation}
                        onStatusChange={handleReservationStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
