
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, Bike, FileText, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParking } from '@/contexts/ParkingContext';
import { useUser } from '@/contexts/UserContext';
import ParkingReceipt from './ParkingReceipt';
import SignInForm from './SignInForm';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';

const ParkingHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { bookingHistory, fetchBookingsByStatus, isLoadingBookings } = useParking();
  const { isAuthenticated } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchBookingsByStatus(selectedTab);
    }
  }, [isAuthenticated, selectedTab, isOpen, fetchBookingsByStatus]);

  const handleSignInSuccess = () => {
    setShowSignInDialog(false);
    toast({
      title: "Signed in successfully",
      description: "You can now view your booking history"
    });
    fetchBookingsByStatus(selectedTab);
  };

  const handleViewReceipt = (booking: any) => {
    setSelectedBooking(booking);
    setShowReceiptDialog(true);
  };

  const handleOpenClick = () => {
    if (!isAuthenticated) {
      setShowSignInDialog(true);
    } else {
      setIsOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'border-blue-500/50 bg-blue-50 text-blue-700';
      case 'ongoing': return 'border-green-500/50 bg-green-50 text-green-700';
      case 'completed': return 'border-gray-500/50 bg-gray-50 text-gray-700';
      case 'cancelled': return 'border-red-500/50 bg-red-50 text-red-700';
      default: return 'border-gray-500/50 bg-gray-50 text-gray-700';
    }
  };

  const renderBookingContent = () => {
    if (isLoadingBookings) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!bookingHistory || bookingHistory.length === 0) {
      return (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No {selectedTab} bookings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Your {selectedTab} parking bookings will appear here.
          </p>
        </div>
      );
    }

    return bookingHistory.map((booking: any) => (
      <div key={booking._id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium">{booking.parkingLot.name}</p>
            <p className="text-xs text-muted-foreground">{`${booking.parkingLot.address.street}, ${booking.parkingLot.address.city}`}</p>
          </div>
          <Badge variant="outline" className={`${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{new Date(booking.startTime).toLocaleDateString()}</div>
          <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{`${new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          {booking.vehicle.type === 'car' ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
          <span>{`${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.licensePlate})`}</span>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t">
          <div className="font-semibold text-base">₹{booking.totalPrice.toFixed(2)}</div>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => handleViewReceipt(booking)}><FileText className="h-3 w-3 mr-1" />View Receipt</Button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleOpenClick}>
        <Clock className="h-4 w-4" />
        <span>Booking History</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Your Parking History</SheetTitle>
            <SheetDescription>View your upcoming, ongoing, and past bookings.</SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="upcoming" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedTab} className="space-y-3 mt-4">
              {renderBookingContent()}
            </TabsContent>
          </Tabs>
          <SheetFooter className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Parking Receipt</DialogTitle>
            <DialogDescription>Details for your booking at {selectedBooking?.parkingLot.name}.</DialogDescription>
          </DialogHeader>
          {selectedBooking && <ParkingReceipt booking={selectedBooking} onClose={() => setShowReceiptDialog(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>Please sign in to view your parking history.</DialogDescription>
          </DialogHeader>
          <SignInForm onSuccess={handleSignInSuccess} onCancel={() => setShowSignInDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParkingHistory;
