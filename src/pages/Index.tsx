
import React from 'react';
import MapComponent from '@/components/MapComponent';
import ManualLocationInput from '@/components/ManualLocationInput';
import { useParking } from '@/contexts/ParkingContext';

const Index = () => {
  const { userLocation } = useParking();

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          Find Your Perfect Parking Spot
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Real-time availability, seamless booking, and stress-free parking.
        </p>
        
        {!userLocation && <ManualLocationInput />}

        <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default Index;
