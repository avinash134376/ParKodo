
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getParkingLots, getParkingLotsNear, createBooking, getUserBookingsByStatus } from '@/api';
import { useUser } from './UserContext';
import { ParkingLot, Booking } from '@/types';

// Define a more specific type for user location
interface UserLocation {
  lat: number;
  lng: number;
}

// Interface for the context
interface ParkingContextType {
  parkingLots: ParkingLot[];
  bookingHistory: Booking[];
  userLocation: UserLocation | null;
  searchParkingLotsByLocation: (location: string) => void;
  fetchNearbyParkingLots: () => Promise<void>;
  addBooking: (booking: any) => Promise<void>;
  fetchBookingsByStatus: (status: string) => Promise<void>;
  setUserLocation: (location: UserLocation | null) => void;
  clearParkingLots: () => void;
  savedParkings: ParkingLot[];
  addSavedParking: (parking: ParkingLot) => void;
  removeParking: (id: string) => void;
  isLoading: boolean;
  isLoadingBookings: boolean;
}

// Create the context with an undefined initial value
const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

// Provider component
export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allParkingLots, setAllParkingLots] = useState<ParkingLot[]>([]);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [savedParkings, setSavedParkings] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await getParkingLots();
        const allLots: ParkingLot[] = response.data || [];
        setAllParkingLots(allLots);
        // Initialize saved parkings with a couple of lots for demonstration
        if (allLots.length > 1) {
          setSavedParkings(allLots.slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching all parking lots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const searchParkingLotsByLocation = (location: string) => {
    const filtered = allParkingLots.filter(lot =>
      lot.name.toLowerCase().includes(location.toLowerCase()) ||
      lot.address.street.toLowerCase().includes(location.toLowerCase()) ||
      lot.address.city.toLowerCase().includes(location.toLowerCase())
    );
    setParkingLots(filtered);
  };

  const fetchNearbyParkingLots = useCallback(async () => {
    if (userLocation) {
      setIsLoading(true);
      try {
        const response = await getParkingLotsNear(userLocation.lng, userLocation.lat);
        setParkingLots(response.data || []);
      } catch (error) {
        console.error('Error fetching nearby parking lots:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userLocation]);

  const addBooking = async (booking: any) => {
    if (!user) throw new Error("User not authenticated");
    await createBooking(booking, user.token);
    // Optionally refetch bookings
  };

  const fetchBookingsByStatus = useCallback(async (status: string) => {
    if (!user) return;
    setIsLoadingBookings(true);
    try {
      const response = await getUserBookingsByStatus(status, user.token);
      setBookingHistory(response.data || []);
    } catch (error) {
      console.error(`Error fetching ${status} bookings:`, error);
      setBookingHistory([]); // Ensure it's an array on error
    } finally {
      setIsLoadingBookings(false);
    }
  }, [user]);

  const clearParkingLots = () => {
    setParkingLots([]);
  };

  const addSavedParking = (parking: ParkingLot) => {
    setSavedParkings(prev => [parking, ...prev.filter(p => p._id !== parking._id)]);
  };

  const removeParking = (id: string) => {
    setSavedParkings(prev => prev.filter(p => p._id !== id));
  };

  const value = {
    parkingLots,
    bookingHistory,
    userLocation,
    searchParkingLotsByLocation,
    fetchNearbyParkingLots,
    addBooking,
    fetchBookingsByStatus,
    setUserLocation,
    clearParkingLots,
    savedParkings,
    addSavedParking,
    removeParking,
    isLoading,
    isLoadingBookings
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};
