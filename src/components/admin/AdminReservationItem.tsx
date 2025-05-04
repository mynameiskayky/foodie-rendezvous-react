
import { useState } from 'react';
import { Reservation } from '@/types';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarCheck, Clock, User, Bell } from 'lucide-react';
import { updateReservationStatus } from '@/services/reservationService';
import { useToast } from '@/components/ui/use-toast';

interface AdminReservationItemProps {
  reservation: Reservation;
  onStatusChange: () => void;
}

const AdminReservationItem = ({ reservation, onStatusChange }: AdminReservationItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'cancel'>('confirm');
  const { toast } = useToast();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'canceled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleOpenDialog = (action: 'confirm' | 'cancel') => {
    setActionType(action);
    setIsDialogOpen(true);
  };

  const handleAction = async () => {
    try {
      const newStatus = actionType === 'confirm' ? 'confirmed' : 'canceled';
      const success = await updateReservationStatus(reservation.id, newStatus);
      
      if (success) {
        toast({
          title: `Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'cancelada'}`,
          description: `A reserva foi ${newStatus === 'confirmed' ? 'confirmada' : 'cancelada'} com sucesso.`,
        });
        onStatusChange();
      } else {
        throw new Error('Não foi possível atualizar o status da reserva');
      }
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar o status da reserva.',
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-purple-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-col mb-2 md:mb-0">
            <div className="flex items-center mb-1">
              <CalendarCheck className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium">{reservation.date} às {reservation.time}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(reservation.status)}`}>
                {formatStatus(reservation.status)}
              </span>
            </div>
            
            <div className="flex items-center mb-1">
              <User className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm">{reservation.customerName} • {reservation.partySize} pessoas</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <Bell className="h-3 w-3 mr-1" />
              {reservation.notes ? 
                <span>Obs: {reservation.notes}</span> : 
                <span>Sem observações</span>
              }
            </div>
          </div>
          
          <div className="flex space-x-2">
            {reservation.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  onClick={() => handleOpenDialog('confirm')}
                >
                  Confirmar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleOpenDialog('cancel')}
                >
                  Cancelar
                </Button>
              </>
            )}
            {reservation.status === 'confirmed' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => handleOpenDialog('cancel')}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'confirm' ? 'Confirmar Reserva' : 'Cancelar Reserva'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'confirm'
                ? `Você confirma a reserva de ${reservation.customerName} para ${reservation.partySize} pessoas em ${reservation.date} às ${reservation.time}?`
                : `Você deseja cancelar a reserva de ${reservation.customerName} para ${reservation.date} às ${reservation.time}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className={actionType === 'confirm' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {actionType === 'confirm' ? 'Sim, confirmar' : 'Sim, cancelar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminReservationItem;
