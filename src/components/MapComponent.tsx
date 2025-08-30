
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, CircleParking, Navigation } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { ParkingLot } from '@/types';

const MapComponent = ({ onMapClick }: { onMapClick?: (location: { lat: number; lng: number }) => void }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { parkingLots = [], userLocation } = useParking() || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current || !onMapClick) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onMapClick({ lat: y, lng: x });
  };

  // Create a consistent set of coordinates for the mock map
  const getMockCoordinates = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; 
    }
    const x = (hash & 0xFF) % 80 + 10; // 10-90
    const y = ((hash >> 8) & 0xFF) % 80 + 10; // 10-90
    return { x, y };
  };

  return (
    <div 
      ref={mapRef}
      className="w-full h-full relative bg-[#f8f9fa] rounded-lg overflow-hidden"
      onClick={handleMapClick}
    >
      {/* Simulated map grid */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i} 
            className="border border-gray-100"
          >
          </div>
        ))}
      </div>
      
      {/* Map loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Simulated parking spots on map */}
      {mapLoaded && parkingLots.map((spot: ParkingLot) => {
        const { x, y } = getMockCoordinates(spot._id);
        const price = spot.hourlyRate || 0;

        return (
          <div 
            key={spot._id}
            className="absolute w-6 h-6 -mt-3 -ml-3 pulse-dot z-20"
            style={{ top: `${y}%`, left: `${x}%` }}
            title={spot.name}
          >
            <CircleParking className="w-full h-full text-primary" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-xs font-medium shadow-sm whitespace-nowrap">
              ₹{price.toFixed(2)}
            </div>
          </div>
        )
      })}
      
      {/* User location marker */}
      {userLocation && (
        <div 
          className="absolute z-30"
          style={{ top: `50%`, left: `50%`, transform: 'translate(-50%, -50%)' }}
          title="Your Location"
        >
          <div className="relative flex justify-center items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
            <div className="absolute w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
          </div>
        </div>
      )}
      
      {/* Navigation controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-md shadow-md z-40">
        <button className="p-2 hover:bg-gray-100 rounded-t-md">
          <Navigation className="w-5 h-5" />
        </button>
        <div className="h-px w-full bg-gray-200"></div>
        <button className="p-2 hover:bg-gray-100">+</button>
        <button className="p-2 hover:bg-gray-100 rounded-b-md">−</button>
      </div>
    </div>
  );
};

export default MapComponent;
