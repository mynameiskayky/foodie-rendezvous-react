
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Utensils, 
  MapPin, 
  Phone, 
  Clock, 
  Save,
  Image,
  Tag
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { createRestaurant } from '@/services/restaurantService';
import { assignRestaurantToUser } from '@/services/authService';
import { Restaurant as RestaurantType } from '@/types';

const cuisineOptions = [
  'Italiana', 'Japonesa', 'Brasileira', 'Indiana', 
  'Francesa', 'Americana', 'Espanhola', 'Portuguesa',
  'Mexicana', 'Tailandesa', 'Mediterrânea', 'Árabe',
  'Chinesa', 'Coreana', 'Vegana', 'Vegetariana'
];

const CreateRestaurantPage = () => {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<RestaurantType, 'id' | 'rating'>>({
    name: '',
    description: '',
    image: '',
    cuisine: 'Italiana',
    priceLevel: 2,
    address: '',
    phone: '',
    openingHours: {
      opens: '18:00',
      closes: '23:00',
    },
    featured: false,
    ownerId: user?.id || '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'priceLevel' ? Number(value) : value,
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create restaurant
      const newRestaurant = await createRestaurant({
        ...formData,
        ownerId: user?.id || '',
      });
      
      // Assign user as restaurant admin
      if (user) {
        const updatedUser = await assignRestaurantToUser(user.id, newRestaurant.id);
        login(updatedUser);
      }
      
      toast({
        title: 'Restaurante criado',
        description: 'Seu restaurante foi criado com sucesso.',
      });
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Erro ao criar restaurante:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível criar seu restaurante.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Criar Restaurante</h1>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Informações do Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome do Restaurante *
                  </label>
                  <div className="relative">
                    <Utensils className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Nome do seu restaurante"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Descrição do Restaurante *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva seu restaurante, especialidades, ambiente, etc."
                    rows={4}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">
                  URL da Imagem Principal *
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="URL da imagem principal"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Use uma imagem de boa qualidade que represente seu restaurante</p>
              </div>
              
              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium mb-1">
                  Tipo de Cozinha *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Select 
                    value={formData.cuisine} 
                    onValueChange={(value) => handleSelectChange(value, 'cuisine')}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Selecione o tipo de cozinha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de Cozinha</SelectLabel>
                        {cuisineOptions.map(cuisine => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label htmlFor="priceLevel" className="block text-sm font-medium mb-1">
                  Faixa de Preço *
                </label>
                <Select 
                  value={String(formData.priceLevel)} 
                  onValueChange={(value) => handleSelectChange(value, 'priceLevel')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Faixa de preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">$ - Econômico</SelectItem>
                    <SelectItem value="2">$$ - Moderado</SelectItem>
                    <SelectItem value="3">$$$ - Caro</SelectItem>
                    <SelectItem value="4">$$$$ - Luxuoso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="opens" className="block text-sm font-medium mb-1">
                  Horário de Abertura *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="opens"
                    name="opens"
                    type="time"
                    value={formData.openingHours.opens}
                    onChange={handleTimeChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="closes" className="block text-sm font-medium mb-1">
                  Horário de Fechamento *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="closes"
                    name="closes"
                    type="time"
                    value={formData.openingHours.closes}
                    onChange={handleTimeChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Endereço Completo *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Endereço completo do restaurante"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Telefone do restaurante"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Criar Restaurante
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRestaurantPage;
