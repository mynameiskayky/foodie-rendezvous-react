
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getRestaurantById } from '@/services/restaurantService';
import { createReservation } from '@/services/reservationService';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, MapPin, Phone, DollarSign, Mail, UserRound } from 'lucide-react';

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('19:00');
  const [partySize, setPartySize] = useState('2');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar os dados do restaurante.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, toast]);

  const generateTimeSlots = () => {
    if (!restaurant) return [];
    
    const { opens, closes } = restaurant.openingHours;
    const slots = [];
    
    // Convert string times to hour numbers
    const startHour = parseInt(opens.split(':')[0], 10);
    const endHour = parseInt(closes.split(':')[0], 10);
    
    // Generate slots every 30 minutes
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour}:00`);
      if (hour !== endHour) slots.push(`${hour}:30`);
    }
    
    return slots;
  };

  const handleReservation = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Necessário',
        description: 'Faça login para realizar uma reserva.',
      });
      navigate('/login');
      return;
    }
    
    if (!restaurant || !date) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor, selecione uma data para sua reserva.',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
      
      await createReservation({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        date: formattedDate,
        time,
        partySize: parseInt(partySize, 10),
        notes,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
      });
      
      toast({
        title: 'Reserva solicitada',
        description: 'Sua reserva foi solicitada com sucesso! Aguarde a confirmação do restaurante.',
      });
      
      navigate('/minhas-reservas');
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível processar sua reserva.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Restaurante não encontrado</h2>
          <Button onClick={() => navigate('/restaurantes')} className="mt-4">
            Ver todos os restaurantes
          </Button>
        </div>
      </div>
    );
  }

  const getPriceLevelDisplay = (level: number) => {
    return Array(level).fill('$').join('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {restaurant.cuisine}
              </span>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                <span className="mr-1">★</span> {restaurant.rating}
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {getPriceLevelDisplay(restaurant.priceLevel)}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{restaurant.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                <span>{restaurant.phone}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span>Aberto das {restaurant.openingHours.opens} às {restaurant.openingHours.closes}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Fazer uma reserva</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date(Date.now() - 86400000)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Horário</label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeSlots().map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pessoas</label>
                <Select value={partySize} onValueChange={setPartySize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Número de pessoas" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'pessoa' : 'pessoas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Observações</label>
                <Textarea
                  placeholder="Alguma preferência ou necessidade especial?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleReservation} 
                disabled={isSubmitting}
                className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90"
              >
                {isSubmitting ? 'Processando...' : 'Reservar Mesa'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
