
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/types';
import { CalendarCheck } from 'lucide-react';
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

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string) => void;
}

const ReservationCard = ({ reservation, onCancel }: ReservationCardProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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

  const handleCancelReservation = () => {
    onCancel(reservation.id);
    setShowCancelDialog(false);
  };

  return (
    <>
      <Card className="overflow-hidden h-full">
        <div className="relative h-36">
          <img
            src={reservation.restaurantImage}
            alt={reservation.restaurantName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(reservation.status)}`}>
              {formatStatus(reservation.status)}
            </span>
          </div>
        </div>
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold">{reservation.restaurantName}</h3>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarCheck className="mr-2 h-4 w-4" />
            <span>{reservation.date} às {reservation.time}</span>
          </div>
          <p className="mt-2 text-sm">
            <span className="font-medium">Mesa para:</span> {reservation.partySize} pessoas
          </p>
          {reservation.notes && (
            <p className="mt-2 text-xs text-gray-500 italic">
              "{reservation.notes}"
            </p>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          {reservation.status !== 'canceled' && (
            <Button 
              variant="outline" 
              className="w-full text-restaurant-primary border-restaurant-primary hover:bg-restaurant-primary hover:text-white"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancelar Reserva
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar sua reserva no {reservation.restaurantName} para o dia {reservation.date} às {reservation.time}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelReservation} className="bg-restaurant-primary hover:bg-restaurant-primary/90">
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReservationCard;
