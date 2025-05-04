
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Restaurant } from '@/types';
import { getRestaurantById } from '@/services/restaurantService';
import { createReservation } from '@/services/reservationService';
import { useAuth } from '@/context/AuthContext';
import { CalendarCheck } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  partySize: z.string().transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val > 0 && val <= 20, 'Número de pessoas deve estar entre 1 e 20'),
  notes: z.string().optional(),
});

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: '',
      time: '',
      partySize: '2',
      notes: '',
    },
  });

  const availableTimes = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const data = await getRestaurantById(id);
        if (data) {
          setRestaurant(data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Restaurante não encontrado',
            description: 'O restaurante que você está procurando não existe.',
          });
          navigate('/restaurantes');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do restaurante:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar as informações do restaurante.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, navigate, toast]);

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

  const handleMakeReservation = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Autenticação necessária',
        description: 'Você precisa estar logado para fazer uma reserva.',
      });
      navigate('/login');
      return;
    }
    
    setReservationDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!restaurant) return;

    try {
      await createReservation({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        date: values.date,
        time: values.time,
        partySize: values.partySize,
        notes: values.notes,
      });
      
      toast({
        title: 'Reserva realizada com sucesso!',
        description: 'Sua reserva foi enviada ao restaurante.',
      });
      
      setReservationDialogOpen(false);
      navigate('/minhas-reservas');
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer reserva',
        description: 'Não foi possível concluir sua reserva. Por favor, tente novamente.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4">Carregando informações do restaurante...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurante não encontrado</h1>
          <p>O restaurante que você está procurando não existe.</p>
          <Button 
            onClick={() => navigate('/restaurantes')}
            className="mt-4 bg-restaurant-primary hover:bg-restaurant-primary/90"
          >
            Ver todos os restaurantes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Restaurant Hero */}
      <div 
        className="h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${restaurant.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-6 py-12 relative h-full flex items-end">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <span className="text-restaurant-secondary mr-1">★</span>
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              <span className="text-white/80">•</span>
              <span>{restaurant.cuisine}</span>
              <span className="text-white/80">•</span>
              <div className="text-sm">{renderPriceLevel(restaurant.priceLevel)}</div>
            </div>
            <p className="text-white/90">{restaurant.address}</p>
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Sobre o restaurante</h2>
              <p className="text-gray-700 mb-6">{restaurant.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-semibold mb-2">Horário de funcionamento</h3>
                  <p>Abre às {restaurant.openingHours.opens} e fecha às {restaurant.openingHours.closes}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contato</h3>
                  <p>{restaurant.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Menu</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Entradas</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Bruschetta</h4>
                            <p className="text-sm text-gray-500">Tomate, alho, manjericão e azeite</p>
                          </div>
                          <div className="font-medium">R$ 25</div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Carpaccio</h4>
                            <p className="text-sm text-gray-500">Fatias finas de carne crua com temperos</p>
                          </div>
                          <div className="font-medium">R$ 40</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Pratos Principais</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Fettuccine Alfredo</h4>
                            <p className="text-sm text-gray-500">Massa fresca com molho cremoso</p>
                          </div>
                          <div className="font-medium">R$ 55</div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Risoto de Cogumelos</h4>
                            <p className="text-sm text-gray-500">Arroz arbóreo, cogumelos frescos e parmesão</p>
                          </div>
                          <div className="font-medium">R$ 60</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sobremesas</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Tiramisù</h4>
                            <p className="text-sm text-gray-500">Clássica sobremesa italiana</p>
                          </div>
                          <div className="font-medium">R$ 30</div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Panna Cotta</h4>
                            <p className="text-sm text-gray-500">Com calda de frutas vermelhas</p>
                          </div>
                          <div className="font-medium">R$ 28</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reservation Sidebar */}
          <div>
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Faça sua reserva</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Selecione uma data e horário para fazer sua reserva no {restaurant.name}
                  </p>
                  
                  <Button 
                    onClick={handleMakeReservation}
                    className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90 mb-4"
                  >
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Reservar mesa
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    <p>Horário de funcionamento:</p>
                    <p className="font-medium">{restaurant.openingHours.opens} - {restaurant.openingHours.closes}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reservation Dialog */}
      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reservar mesa - {restaurant.name}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="" disabled>Selecione...</option>
                          {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="partySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de pessoas</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações adicionais ou solicitações especiais..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setReservationDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-restaurant-primary hover:bg-restaurant-primary/90"
                >
                  Confirmar Reserva
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantDetailPage;
