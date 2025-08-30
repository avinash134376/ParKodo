
import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const ManualLocationInput = () => {
  const { setUserLocation } = useParking();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleSetLocation = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!isNaN(latNum) && !isNaN(lngNum)) {
      setUserLocation({ lat: latNum, lng: lngNum });
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">Manual Location</h3>
      </div>
      <p className="text-sm text-yellow-700 mb-3">
        Geolocation is disabled. Please enter your coordinates manually to find nearby parking.
      </p>
      <div className="flex gap-2">
        <Input 
          type="text" 
          placeholder="Latitude (e.g., 40.7128)" 
          value={lat} 
          onChange={(e) => setLat(e.target.value)} 
          className="bg-white"
        />
        <Input 
          type="text" 
          placeholder="Longitude (e.g., -74.0060)" 
          value={lng} 
          onChange={(e) => setLng(e.target.value)} 
          className="bg-white"
        />
        <Button onClick={handleSetLocation}>Set</Button>
      </div>
    </div>
  );
};

export default ManualLocationInput;
