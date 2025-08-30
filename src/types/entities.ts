
// Represents the structure of a single parking lot
export interface ParkingLot {
  spotTypes: any;
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  hourlyRate: number;
  rating: number;
  features: {
    surveillance: boolean;
    evCharging: boolean;
    covered: boolean;
  };
  capacity: number;
}

// Represents a single booking record
export interface Booking {
  _id: string;
  parkingLot: ParkingLot;
  user: string; // User ID
  startTime: string; // ISO Date String
  endTime: string;   // ISO Date String
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
  };
  totalCost: number;
}
