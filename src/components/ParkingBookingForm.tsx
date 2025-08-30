
import React, { useState, useEffect } from 'react';
import { Navigation, AlertTriangle, Loader, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { useParking } from '@/contexts/ParkingContext';
import { useUser } from '@/contexts/UserContext';
import ParkingReceipt from './ParkingReceipt';
import SignInForm from './SignInForm';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import LocationSearch from './LocationSearch';
import SpotSelection from './SpotSelection';
import VehicleSelector from './VehicleSelector';

// Stripe Imports
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const ParkingBookingForm = () => {
  const [location, setLocation] = useState('');
  const [selectedParking, setSelectedParking] = useState<any | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [bookingStep, setBookingStep] = useState<'search' | 'spots' | 'payment' | 'confirmation'>('search');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // 1 hour from now
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [locationError, setLocationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Stripe State
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { 
    parkingLots,
    searchParkingLotsByLocation,
    fetchNearbyParkingLots,
    addBooking,
    clearParkingLots
  } = useParking();
  const { user, isAuthenticated } = useUser();

  const handleFindParking = () => {
    if (!location) {
      setLocationError('Please enter a location.');
      return;
    }
    setLocationError('');
    setIsLoading(true);
    searchParkingLotsByLocation(location);
    setTimeout(() => {
      setIsLoading(false);
      setBookingStep('spots');
    }, 500); // Simulate search time
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    setLocationError('');
    await fetchNearbyParkingLots();
    setIsLoading(false);
    setBookingStep('spots');
  };

  const handleSelectParking = (parking: any) => {
    setSelectedParking(parking);
    setBookingStep('payment');
  };

  const handleProceedToPayment = async () => {
    if (!isAuthenticated) {
      setShowSignInDialog(true);
      return;
    }

    if (!selectedVehicle) {
      toast({ title: "Please select a vehicle", variant: "destructive" });
      return;
    }

    // Create a payment intent on the backend
    try {
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(totalPrice * 100) })
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setPaymentError('Error creating payment intent');
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessingPayment(true);

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required'
    });

    if (result.error) {
      setPaymentError(result.error.message || 'An unexpected error occurred.');
      setIsProcessingPayment(false);
    } else {
      // Payment succeeded
      const booking = {
        parkingLotId: selectedParking._id,
        vehicleId: selectedVehicle,
        startTime,
        endTime,
        totalPrice,
        paymentIntentId: result.paymentIntent.id
      };

      try {
        await addBooking(booking);
        setCurrentBooking(booking);
        setBookingStep('confirmation');
      } catch (error) {
        console.error('Error creating booking:', error);
        setPaymentError('Error creating booking');
      }

      setIsProcessingPayment(false);
    }
  };

  const handleSignInSuccess = () => {
    setShowSignInDialog(false);
    toast({ title: "Signed in successfully" });
  };

  const handleBackStep = () => {
    setClientSecret(null);
    setPaymentError(null);
    setIsProcessingPayment(false);

    switch (bookingStep) {
      case 'spots':
        setBookingStep('search');
        clearParkingLots();
        break;
      case 'payment':
        setBookingStep('spots');
        break;
      case 'confirmation':
        setBookingStep('search');
        setSelectedParking(null);
        setLocation('');
        setSelectedVehicle('');
        setCurrentBooking(null);
        setTotalPrice(0);
        clearParkingLots();
        break;
    }
  };

  useEffect(() => {
    if (selectedParking) {
      const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const vehicleType = selectedVehicle.includes('car') ? 'car' : 'bike';
      const pricePerHour = vehicleType === 'car'
        ? selectedParking.spotTypes.find((spot: any) => spot.type === 'regular').pricePerHourCar
        : selectedParking.spotTypes.find((spot: any) => spot.type === 'regular').pricePerHourBike;
      setTotalPrice(durationInHours * pricePerHour);
    }
  }, [selectedParking, startTime, endTime, selectedVehicle]);

  const renderBookingStep = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Finding parking spots...</p>
        </div>
      );
    }

    switch (bookingStep) {
      case 'search':
        return (
          <div className="space-y-4">
            <LocationSearch
              location={location}
              setLocation={setLocation}
              locationError={locationError}
              onFindParking={handleFindParking}
            />
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-muted"></span>
              <span className="relative bg-white px-2 text-sm text-muted-foreground">OR</span>
            </div>
            <Button variant="outline" className="w-full" onClick={handleUseCurrentLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              Use My Current Location
            </Button>
          </div>
        );
      case 'spots':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Button variant="ghost" size="sm" onClick={handleBackStep} className="px-2">
                <Search className="h-4 w-4 mr-1" />
                New Search
              </Button>
            </div>
            <VehicleSelector selectedVehicle={selectedVehicle} onSelectVehicle={setSelectedVehicle} />
            <SpotSelection
              parkingLots={parkingLots}
              selectedVehicle={selectedVehicle}
              onSelectParking={handleSelectParking}
            />
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Button variant="ghost" size="sm" onClick={handleBackStep} className="px-2">
                <Navigation className="h-4 w-4 rotate-180 mr-1" />
                Back
              </Button>
            </div>
            {clientSecret ? (
              <form onSubmit={handlePaymentSubmit} id="payment-form">
                <PaymentElement options={{ layout: 'tabs' }} />
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg mt-4">
                  <div className="text-sm font-medium">Total Price</div>
                  <div className="text-lg font-semibold">₹{totalPrice.toFixed(2)}</div>
                </div>
                <Button
                  className="w-full mt-4"
                  type="submit"
                  disabled={!stripe || !elements || isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing Payment...' : `Pay ₹${totalPrice.toFixed(2)}`}
                </Button>
              </form>
            ) : (
              <Button className="w-full" onClick={handleProceedToPayment}>
                Proceed to Payment
              </Button>
            )}
            {paymentError && (
              <div className="text-destructive text-sm flex items-center justify-center mt-2">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {paymentError}
              </div>
            )}
          </div>
        );
      case 'confirmation':
        return (
          <div className="space-y-5 py-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground mb-2">Your parking spot has been reserved.</p>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowReceiptDialog(true)}
              >
                View Receipt
              </Button>
              <Button className="w-full" onClick={() => handleBackStep()}>
                Book Another Spot
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Card className="w-full shadow-lg border-none">
        <CardContent className="p-4">
          {renderBookingStep()}
        </CardContent>
      </Card>

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>Sign in to continue with your booking</DialogDescription>
          </DialogHeader>
          <SignInForm
            onSuccess={handleSignInSuccess}
            onCancel={() => setShowSignInDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Parking Receipt</DialogTitle>
            <DialogDescription>Details of your parking booking</DialogDescription>
          </DialogHeader>
          {currentBooking && (
            <ParkingReceipt
              booking={currentBooking}
              onClose={() => setShowReceiptDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParkingBookingForm;
