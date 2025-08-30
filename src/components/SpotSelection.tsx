
import React from 'react';
import { Car, Bike, Star } from 'lucide-react';

interface SpotSelectionProps {
  parkingLots: any[];
  selectedVehicle: string;
  onSelectParking: (parking: any) => void;
}

const SpotSelection: React.FC<SpotSelectionProps> = ({ parkingLots, selectedVehicle, onSelectParking }) => {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {parkingLots.map((spot) => {
        const vehicleType = selectedVehicle.includes('car') ? 'car' : 'bike';
        const hasSpots = vehicleType === 'car' ? spot.availableSpotsCar > 0 : spot.availableSpotsMotorbike > 0;

        return (
          <div
            key={spot._id}
            className={`p-3 border rounded-lg relative cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
              !hasSpots ? "border-red-200 bg-red-50" : ""
            }`}
            onClick={() => onSelectParking(spot)}
          >
            <div className="flex justify-between mb-1">
              <div className="font-medium">{spot.name}</div>
              <div className="text-sm pr-8">{spot.distance}</div>
            </div>
            <div className="text-sm text-muted-foreground mb-1">{spot.address.street}, {spot.address.city}</div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-2">
                  <div className={`${
                    spot.availableSpotsCar > 0
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  } px-2 py-0.5 rounded text-xs font-medium flex items-center`}>
                    <Car className="h-3 w-3 mr-1" />
                    {spot.availableSpotsCar > 0 ? spot.availableSpotsCar : "Full"}
                  </div>
                  <div className={`${
                    spot.availableSpotsMotorbike > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  } px-2 py-0.5 rounded text-xs font-medium flex items-center`}>
                    <Bike className="h-3 w-3 mr-1" />
                    {spot.availableSpotsMotorbike > 0 ? spot.availableSpotsMotorbike : "Full"}
                  </div>
                </div>
                <div className="text-yellow-500 flex items-center text-xs">
                  <Star className="h-4 w-4 mr-1" /> {spot.rating}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-blue-600">
                  <Car className="h-3.5 w-3.5" />
                  <span className="font-medium">₹{spot.spotTypes.find(st => st.type === 'regular').pricePerHourCar.toFixed(2)}/hr</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Bike className="h-3.5 w-3.5" />
                  <span className="font-medium">₹{spot.spotTypes.find(st => st.type === 'regular').pricePerHourBike.toFixed(2)}/hr</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpotSelection;
