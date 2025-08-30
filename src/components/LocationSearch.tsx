
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationSearchProps {
  location: string;
  setLocation: (location: string) => void;
  onFindParking: () => void;
  locationError?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ location, setLocation, onFindParking, locationError }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Find Your Parking Spot</h2>
        <p className="text-muted-foreground text-sm">Enter your destination to find available parking.</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Enter a location (e.g., 'downtown')"
            className="pl-10"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onFindParking()}
          />
        </div>
        <Button onClick={onFindParking}>Find Parking</Button>
      </div>
      {locationError && <p className="text-destructive text-sm text-center">{locationError}</p>}
    </div>
  );
};

export default LocationSearch;
